# fit.py [key=value ...]: the model's silhouette against the reference's, per ring (first ring met by each pixel's ray in
# the photograph's framing), IoU per ring and overall; out/lect/fit.png overlays the outlines (red: reference, blue: model)
import sys, os, importlib.util, cv2, numpy as np
sys.argv = ['mk.py', 'photo'] + sys.argv[1:]
sp = importlib.util.spec_from_file_location('coupes_mk', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mk.py'))
mk = importlib.util.module_from_spec(sp); sp.loader.exec_module(mk)


def labels(ss=1):
    H, W = 933, 700
    gx = (np.arange(W * ss) + .5) / ss; gy = (np.arange(H * ss) + .5) / ss
    XX, YY = np.meshgrid(gx, gy)
    xm = (XX - mk.AX) / mk.PK; yu = (mk.YF - YY) / mk.PK
    z0 = 40.0
    o = np.stack([xm.ravel(), (yu + z0 * mk.TE).ravel(), np.full(xm.size, z0)], 1)
    d = np.tile(mk.DV, (len(o), 1))
    bt, bk, bj = mk.first_hit(o, d, -1e9)
    lab = np.where(np.isfinite(bt), bk + 1, 0).reshape(H * ss, W * ss)
    return lab


if __name__ == '__main__':
    lab = labels()
    ref = cv2.imread('out/lect/anneaux.png', 0)
    res = {}
    for k in range(1, 5):
        a, b = ref == k, lab == k
        res[mk.RINGS[k - 1].name] = round(float((a & b).sum() / max(1, (a | b).sum())), 4)
    a, b = ref > 0, lab > 0
    res['silhouette'] = round(float((a & b).sum() / (a | b).sum()), 4)
    print(res)
    im = cv2.imread('out/ref.jpg')
    for m_, c in ((a, (0, 0, 255)), (b, (255, 0, 0))):
        cs, _ = cv2.findContours(m_.astype(np.uint8), cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
        cv2.drawContours(im, cs, -1, c, 1)
    for k in range(1, 5):
        cs, _ = cv2.findContours((lab == k).astype(np.uint8), cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
        cv2.drawContours(im, cs, -1, (255, 120, 0), 1)
    cv2.imwrite('out/lect/fit.png', im)
