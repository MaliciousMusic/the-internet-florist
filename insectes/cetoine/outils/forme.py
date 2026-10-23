"""forme.py: the rose chafer's outline measured on the studio photos (PROTOCOLE §2), in millimetres of the body frame, numbers only.

  python insectes/cetoine/outils/forme.py dessus <photo> <out.json> --lt <mm> --tete <y> --apex <y> --pronotum <y0,y1> [--ouvrir 40]
  python insectes/cetoine/outils/forme.py profil <photo> <out.json> --front <x> --apex <x> --lpe <mm> [--fond auto]

dessus: a dorsal photo on a plain ground (c114), head up. The beetle is cut from the ground, its legs taken off by an opening of
--ouvrir px; the body axis is fitted through the midpoints of the clean rows (pronotum and elytra); --tete and --apex are the rows of
the clypeus front and of the elytral apex on the axis (px), the scale being --lt mm between them (the length chosen for the model,
DECISIONS: true size). --pronotum: the rows of its front and hind margins on the midline. Writes the half-width per 0.25 mm of x
(x forward from the pronotum's hind margin, mm) and the landmarks.
profil: a side photo on a plain ground (c111), head to the left: the dorsal line and the ventral line per 0.25 mm of x, the scale set
by the length from the pronotum's front (--front, px column) to the elytral apex (--apex), given as --lpe mm (read on the dorsal
measure). Each writes refcache/cetonia-aurata/cartes/forme-<nom>.jpg (the photo with what was read)."""
import sys, os, json
import numpy as np
import cv2

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
REF = os.path.join(ROOT, 'refcache', 'cetonia-aurata')
opt = lambda a, k, d=None: a[a.index(k) + 1] if k in a else d


def cut(img, thr=28):
    h, w = img.shape[:2]
    bg = np.median(np.concatenate([img[:20, :20].reshape(-1, 3), img[:20, -20:].reshape(-1, 3), img[-20:, :20].reshape(-1, 3), img[-20:, -20:].reshape(-1, 3)]), 0)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    bl = cv2.cvtColor(np.uint8([[bg]]), cv2.COLOR_BGR2LAB)[0, 0].astype(np.float32)
    m = (np.abs(lab - bl).sum(-1) > thr).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    n, lb, st, _ = cv2.connectedComponentsWithStats(m); m = (lb == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))).astype(np.uint8)
    ff = m.copy(); fm = np.zeros((h + 2, w + 2), np.uint8); cv2.floodFill(ff, fm, (0, 0), 1)
    return (m | (1 - ff)).astype(np.uint8)


def opened(m, r):
    o = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1)))
    n, lb, st, _ = cv2.connectedComponentsWithStats(o)
    return (lb == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))).astype(np.uint8)


def dessus(a):
    img = cv2.imread(os.path.join(REF, 'hd', a[1] + '.jpg')); out = a[2]
    lt = float(opt(a, '--lt')); yt, ya = float(opt(a, '--tete')), float(opt(a, '--apex'))
    p0, p1 = map(float, opt(a, '--pronotum').split(',')); r = int(opt(a, '--ouvrir', 40))
    m = opened(cut(img), r)
    rows = []
    for y in range(int(yt), int(ya)):
        xs = np.nonzero(m[y])[0]
        if len(xs): rows.append((y, xs[0], xs[-1]))
    R = np.array(rows, float)
    # the axis through the midpoints of the clean rows: the pronotum's and the hind half of the elytra
    sel = ((R[:, 0] > p0 + 0.3 * (p1 - p0)) & (R[:, 0] < p1 - 0.05 * (p1 - p0))) | (R[:, 0] > ya - 0.35 * (ya - yt))
    A = np.polyfit(R[sel, 0], (R[sel, 1] + R[sel, 2]) / 2, 1)
    ang = np.degrees(np.arctan(A[0]))
    # rotate the mask so the axis is vertical, about the axis point at the pronotum's hind margin
    cx = np.polyval(A, p1)
    M = cv2.getRotationMatrix2D((cx, p1), -ang, 1.0)
    mr = cv2.warpAffine(m, M, (m.shape[1], m.shape[0]), flags=cv2.INTER_NEAREST)
    k = lt / (ya - yt)                                        # mm per px
    X, HW, HL, HR = [], [], [], []
    for x in np.arange(-(ya - p1) * k, (p1 - yt) * k + 1e-6, 0.25):
        y = int(round(p1 - x / k)); xs = np.nonzero(mr[min(mr.shape[0] - 1, max(0, y))])[0]
        if not len(xs): continue
        X.append(round(float(x), 2)); HL.append(round(float((cx - xs[0]) * k), 3)); HR.append(round(float((xs[-1] - cx) * k), 3))
        HW.append(round(float((xs[-1] - xs[0]) / 2 * k), 3))
    rec = {'_doc': 'forme.py dessus sur %s : demi-largeurs (mm) par x (mm, vers l\'avant depuis le bord postérieur du pronotum), '
                   'gauche (image) et droite, et leur moyenne. Échelle : %.2f mm du clypéus à l\'apex des élytres.' % (a[1], lt),
           'photo': a[1], 'px_par_mm': round(1 / k, 2), 'axe_inclinaison_deg': round(float(ang), 2), 'origine_px': [round(float(cx), 1), p1],
           'reperes_mm': {'clypeus': round((p1 - yt) * k, 3), 'pronotum_avant': round((p1 - p0) * k, 3), 'apex': round(-(ya - p1) * k, 3)},
           'x': X, 'demi_largeur': HW, 'gauche': HL, 'droite': HR}
    json.dump(rec, open(out, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False)
    # control
    v = img.copy(); cnt, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cv2.drawContours(v, cnt, -1, (255, 0, 255), 2)
    for yy in (yt, ya, p0, p1): cv2.line(v, (0, int(yy)), (v.shape[1], int(yy)), (0, 200, 255), 1)
    cv2.line(v, (int(np.polyval(A, yt)), int(yt)), (int(np.polyval(A, ya)), int(ya)), (0, 255, 0), 1)
    s = 900 / v.shape[0]; cv2.imwrite(os.path.join(REF, 'cartes', 'forme-%s.jpg' % a[1]), cv2.resize(v, None, fx=s, fy=s, interpolation=cv2.INTER_AREA))
    print(out, 'axe %.2f°, %.1f px/mm' % (ang, 1 / k), 'largeur max %.2f mm' % (2 * max(HW)))


def profil(a):
    img = cv2.imread(os.path.join(REF, 'hd', a[1] + '.jpg')); out = a[2]
    xf, xa, lpe = float(opt(a, '--front')), float(opt(a, '--apex')), float(opt(a, '--lpe'))
    m = cut(img)
    k = lpe / (xa - xf)
    X, TOP, BOT = [], [], []
    for x in range(int(min(xf, xa)) - 400, int(max(xf, xa)) + 60, 4):
        if x < 0 or x >= m.shape[1]: continue
        ys = np.nonzero(m[:, x])[0]
        if not len(ys): continue
        X.append(round(float((xa - x) * k), 3)); TOP.append(int(ys[0])); BOT.append(int(ys[-1]))
    ytop = min(TOP)
    rec = {'_doc': 'forme.py profil sur %s : par x (mm depuis l\'apex des élytres vers l\'avant), la ligne dorsale et la ligne la plus basse '
                   '(mm sous le sommet des élytres). Échelle : %.2f mm du front du pronotum à l\'apex.' % (a[1], lpe),
           'photo': a[1], 'px_par_mm': round(1 / k, 2), 'x_depuis_apex': X,
           'dos': [round((t - ytop) * k, 3) for t in TOP], 'bas': [round((b - ytop) * k, 3) for b in BOT]}
    json.dump(rec, open(out, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False)
    print(out, '%.1f px/mm' % (1 / k), 'hauteur max %.2f mm' % (max(rec['bas'])))


if __name__ == '__main__':
    a = sys.argv[1:]
    {'dessus': dessus, 'profil': profil}[a[0]](a)
