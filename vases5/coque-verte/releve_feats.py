# The light model of the photograph (vases5/coque-verte), shared by releve.py (which fits it) and mk.py (which renders it):
# per pixel features of the measured surface -> a linear model per CIELAB channel. Terms: 2nd-order spherical-harmonics
# irradiance of the normal (9), the cavity (2), three candidate key lights with their cast shadows (6), and a smooth cubic
# fall-off of the studio's lights across the image plane (9).
import numpy as np, cv2

PX = 20.6                                                          # photo pixels per cm
LIGHTS = [(-.85, .25, .46), (-.6, .5, .62), (-.95, -.05, .3)]      # camera frame: x right, y up, z to the eye


def cast_shadow(Z, l, sil, steps=140):
    """soft cast shadow from the calibrated depth (cm): does the surface rise above the ray towards the light?"""
    H, W = Z.shape
    l = np.array(l, float); l /= np.linalg.norm(l)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    sh = np.zeros((H, W), np.float32)
    Zf = np.where(sil, Z, -50).astype(np.float32)
    for t in np.arange(2, steps, 2.0):
        dx, dy = l[0] * t, -l[1] * t
        zr = Z + l[2] * t / PX
        zm_ = cv2.remap(Zf, (xx + dx).astype(np.float32), (yy + dy).astype(np.float32), cv2.INTER_LINEAR,
                        borderMode=cv2.BORDER_CONSTANT, borderValue=-50)
        sh = np.maximum(sh, np.clip((zm_ - zr - .3) / .8, 0, 1))
    return sh


def feats(nrm, cav, SH, ED=None):
    H, W = cav.shape
    YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)
    x, y, z = nrm[..., 0], nrm[..., 1], nrm[..., 2]
    one = np.ones_like(x)
    c = np.clip(cav, -3, 3)
    f = [one, x, y, z, x * y, x * z, y * z, x * x - y * y, 3 * z * z - 1, c, c * c]
    for l, sh in zip(LIGHTS, SH):
        l = np.array(l) / np.linalg.norm(l)
        lam = np.clip(x * l[0] + y * l[1] + z * l[2], 0, None)
        f += [lam * (1 - sh), sh]
    u, w_ = (XX - 300) / 300, (YY - 480) / 400
    f += [u, w_, u * u, u * w_, w_ * w_, u ** 3, u * u * w_, u * w_ * w_, w_ ** 3]
    if ED is not None:
        # near the edges: the rim of the outline (velvet, grazing light) and the step at the parts' meeting lines
        for d in ED:
            f += [np.exp(-d / 1.5), np.exp(-d / 4.0), np.exp(-d / 10.0)]
    return np.stack(f, -1).astype(np.float32)
