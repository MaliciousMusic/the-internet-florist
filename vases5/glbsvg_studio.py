# The studio mirrored by a glossy surface (soft boxes seen in the reflected direction), shared by glbsvg.py and verrelys.py.
import numpy as np


def studio(nb, rough, OPT):
    F = lambda k, d: float(OPT.get(k, d))
    """the studio mirrored by a glossy glaze: soft boxes seen in the reflected direction (view along -z, nearly orthographic).
    Each box: centre azimuth / elevation, half width / half height (degrees), intensity; its edges soften with roughness"""
    nx, ny, nz = nb[..., 0], nb[..., 1], nb[..., 2]
    Rx, Ry, Rz = 2 * nz * nx, 2 * nz * ny, 2 * nz * nz - 1
    az = np.degrees(np.arctan2(Rx, Rz)); el = np.degrees(np.arctan2(-Ry, np.hypot(Rx, Rz)))
    boxes = OPT.get('boxes', '-38,22,16,26,1;58,4,7,34,.55;0,72,60,14,.35;-75,-5,6,30,.3')
    out = np.zeros_like(nx)
    soft = 3 + F('bsoft', 18) * rough
    for b in boxes.split(';'):
        ca, ce, hw, hh, it = [float(v) for v in b.split(',')]
        da = np.abs((az - ca + 180) % 360 - 180) - hw; de = np.abs(el - ce) - hh
        wa = np.clip(.5 - da / soft, 0, 1); we = np.clip(.5 - de / soft, 0, 1)
        out = np.maximum(out, it * wa * we)
    fres = .06 + .94 * (1 - np.clip(nz, 0, 1)) ** 5
    return out * (F('fr0', .55) + fres) * (1 - rough) ** F('gpow', 1.0)
