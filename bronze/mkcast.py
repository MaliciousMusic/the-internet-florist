"""mkcast.py: the design of the cast bronze carp vessel, traced on its reference photograph (pixels), turned into the engine's surface
coordinates: angle round the axis (radians, 0 facing the eye, + to the right) and height above the foot (units, 6.5 per cm).
Writes app/v1h.js (the design) and prints the vessel's profile. The photograph itself is never published."""
import json, math

AX, Y0, SE = 609.0, 1209.0, .0756          # axis x, foot line y (the axis at the foot), sine of the camera's elevation
CE = math.sqrt(1 - SE * SE)
K = .15325                                  # units per pixel (the vessel 150 units tall, 23 cm)
PROF = [[0, 36.6], [1, 37.6], [2.5, 38.1], [5.8, 38.4], [6.4, 38.1], [7.2, 39.0], [9.4, 39.6], [12.1, 41.0], [14.9, 42.4], [17.7, 43.9],
        [20.4, 45.5], [23.2, 47.1], [26, 48.6], [28.7, 50.1], [31.5, 51.5], [34.3, 52.8], [37, 54.1], [39.8, 55.3], [42.6, 56.4], [45.3, 57.6],
        [48.1, 58.5], [50.9, 59.6], [53.6, 60.6], [56.4, 61.6], [59.2, 62.5], [61.9, 63.4], [64.7, 64.1], [67.5, 64.7], [70.2, 65.4], [73, 65.9],
        [75.8, 66.4], [78.5, 66.7], [81.3, 66.9], [84.1, 67.1], [86.8, 67.2], [89.6, 67.2], [92.4, 67.1], [95.1, 67.0], [97.9, 66.8], [100.7, 66.4],
        [103.4, 65.9], [106.2, 65.3], [109, 64.7], [111.7, 63.9], [114.5, 62.8], [117.3, 61.8], [120, 60.5], [122.8, 59.0], [125.6, 57.3],
        [128.3, 55.3], [131.1, 52.9], [133.9, 50.1], [136.6, 46.7], [139.4, 43.1], [142.2, 39.4], [144.5, 36.8], [146.5, 35.5], [148.2, 35.0],
        [149.3, 35.4], [150.2, 35.6]]


# the traced radii smoothed between the foot and the neck (the tracing's pixel noise would show as bands in the reflections)
_P = [p[:] for p in PROF]
for _ in range(2):
    PROF = [PROF[0]] + [[PROF[i][0], round((PROF[i - 1][1] + 2 * PROF[i][1] + PROF[i + 1][1]) / 4, 2) if 8 < PROF[i][0] < 141 else PROF[i][1]]
                        for i in range(1, len(PROF) - 1)] + [PROF[-1]]


def R(h):
    if h <= PROF[0][0]: return PROF[0][1]
    for (h0, r0), (h1, r1) in zip(PROF, PROF[1:]):
        if h1 >= h: return r0 + (r1 - r0) * (h - h0) / (h1 - h0)
    return PROF[-1][1]


def surf(x, y, d=0.0):
    """photo pixel -> (angle, height) on the turned surface; d: the point's relief height (its displacement along the normal is undone)"""
    h = (Y0 - y) * K / CE
    ph = 0.0
    for _ in range(6):
        r = R(h)
        s = max(-.999, min(.999, ((x - AX) * K - d * math.sin(ph)) / r))
        ph = math.asin(s)
        h = ((Y0 - y) * K + r * SE * math.cos(ph)) / CE
    return [round(ph, 4), round(h, 2)]


def smooth(pts, closed=False, k=6):
    """a traced line made smooth: Catmull-Rom through its points, k steps per span (pixels)"""
    P = list(pts)
    n = len(P)
    if n < 3: return P
    out = []
    spans = n if closed else n - 1
    for i in range(spans):
        p0 = P[(i - 1) % n] if closed else P[max(0, i - 1)]
        p1, p2 = P[i % n], P[(i + 1) % n]
        p3 = P[(i + 2) % n] if closed else P[min(n - 1, i + 2)]
        for j in range(k):
            s = j / k
            out.append(tuple(.5 * (2 * p1[c] + (-p0[c] + p2[c]) * s + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * s * s + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * s ** 3) for c in (0, 1)))
    if not closed: out.append(P[-1])
    return out


def line(pts, d=0.0, closed=False, k=6):
    return [surf(x, y, d) for x, y in smooth(pts, closed, k)]


def resample(pts, n):
    """a polyline resampled to n points evenly by arc length (in pixels)"""
    L = [0.0]
    for a, b in zip(pts, pts[1:]): L.append(L[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    out, j = [], 0
    for i in range(n):
        s = L[-1] * i / (n - 1)
        while j < len(L) - 2 and L[j + 1] < s: j += 1
        u = (s - L[j]) / max(1e-9, L[j + 1] - L[j])
        a, b = pts[j], pts[j + 1]
        out.append((a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u))
    return out


# ---------- the water: crests (a gentle back rising to the crest, a steep front), incised and raised lines, rings, a splash ----------
# crest: [height, front width, back length, raised side (+1: left of the way the line runs, in angle-height space with height up), taper in, taper out, line]
CREST = [
    [.62, .5, 12, 1, 12, 3, [(255, 505), (280, 499), (300, 499), (320, 498), (340, 496), (360, 494), (380, 495), (400, 498), (420, 503), (440, 508), (460, 516),
                              (480, 524), (500, 533), (520, 544), (540, 557), (560, 571), (580, 585), (600, 599), (620, 612), (650, 632), (700, 665), (750, 698),
                              (800, 730), (834, 748)]],
    [.45, .45, 8, 1, 4, 5, [(918, 742), (950, 752), (982, 753), (1012, 745), (1042, 731)]],
    [.5, .45, 4, 1, 5, 2, [(192, 748), (210, 765), (235, 779), (260, 789), (285, 793), (306, 789)]],
    [.42, .4, 2.5, -1, 2, 2, [(316, 757), (332, 771), (340, 790), (333, 807), (313, 818)]],
    [.55, .5, 10, 1, 8, 2, [(500, 810), (518, 822), (560, 848), (600, 878), (640, 910), (668, 940), (688, 966)]],
    [.35, .4, 5, 1, 4, 3, [(540, 852), (575, 873), (610, 900), (640, 925), (662, 948)]],
    [.45, .45, 3.5, 1, 3, 4, [(545, 944), (505, 950), (483, 962), (478, 976), (490, 995), (520, 1018), (560, 1034), (610, 1045), (680, 1053), (760, 1052),
                            (840, 1043), (900, 1028), (950, 1008), (985, 982), (1002, 955)]],
    [.3, .35, 2.5, 1, 2, 3, [(565, 984), (535, 991), (529, 1003), (560, 1018), (640, 1030), (740, 1034), (840, 1024), (902, 1006)]],
    [.35, .4, 5, 1, 3, 3, [(952, 944), (995, 905), (1036, 866)]],
]
# incised lines: [depth, half width, line]
GROOVE = [
    [.22, .5, [(372, 470), (420, 476), (480, 492), (530, 513), (570, 538), (610, 565), (650, 595), (700, 625), (750, 657), (800, 692), (836, 712)]],
    [.18, .45, [(740, 1088), (820, 1072), (900, 1053), (955, 1038)]],
    [.16, .45, [(790, 1046), (870, 1020), (948, 993)]],
    [.15, .45, [(966, 956), (1010, 915), (1046, 880)]],
]
# raised threads: [height, half width, line]
RIDGE = [
    [.26, .55, [(238, 672), (260, 675), (282, 679)]],
    [.24, .55, [(243, 690), (263, 692), (281, 695)]],
    [.3, .6, [(246, 748), (260, 752), (268, 762), (263, 773)]],
    [.2, .5, [(358, 822), (370, 825), (382, 828)]],
]
# bubbles: [height, half width, x, y, radius in pixels]
RING = [[.26, .42, 790, 958, 7], [.24, .4, 821, 963, 5.5], [.22, .38, 846, 956, 4]]
# the splash: [height, edge width, outline]
BLOB = [[.55, .6, [(612, 1036), (650, 1022), (678, 1012), (688, 997), (696, 1010), (718, 1003), (736, 997), (724, 1009), (702, 1020), (662, 1031)]]]

# ---------- the carp, in high relief, leaping and seen from the back: its two contours (outer and inner flank, snout to tail base), thickness along
# it, eye, gill cover, mouth; the crest of its back (mid) and the dorsal fin's span over the inner flank (fin); the pectoral and pelvic fins, the tail ----------
BACK = [(706, 433), (712, 423), (740, 416), (770, 419), (800, 429), (838, 448), (870, 474), (895, 495), (915, 515), (931, 540), (948, 567), (962, 594), (972, 621),
        (978, 648), (978, 675), (971, 700), (958, 720), (940, 737), (916, 751), (893, 761), (868, 768)]
BELLY = [(706, 435), (709, 444), (730, 466), (750, 490), (770, 509), (790, 524), (806, 539), (821, 552), (838, 566), (855, 582), (870, 600), (883, 620), (893, 645),
         (898, 670), (896, 695), (886, 717), (867, 732), (850, 742), (845, 748)]
N = 26
TH = [3.0, 4.0, 4.6, 5.0, 5.2, 5.4, 5.5, 5.5, 5.5, 5.5, 5.4, 5.3, 5.2, 5.0, 4.8, 4.6, 4.4, 4.1, 3.8, 3.5, 3.2, 2.9, 2.6, 2.4, 2.2, 2.1]
bk, bl = resample(BACK, N), resample(BELLY, N)
# the back contour seen on the right of the vessel is the rounded body's own edge, half its thickness out along the normal: undo that
D = [surf(x, y, TH[i] * .15) for i, (x, y) in enumerate(bk)]
V = [surf(x, y, 0) for x, y in bl]
EYE = surf(787, 444, 3.0) + [1.2]
GILL = line([(832, 446), (843, 466), (849, 490), (848, 514), (840, 536), (828, 553)], 4.8)
MOUTH = line([(709, 436), (716, 447), (725, 453)], 1.0)
NOSTRIL = surf(727, 428, 2.5)
# fins: [ray centre, outline, thickness at the centre, at the edge, rays]
FINS = [
    [(868, 470), [(848, 452), (862, 441), (880, 433), (898, 431), (911, 438), (914, 452), (910, 470), (903, 486), (894, 497)], 1.9, .7, 13, 2.2],
    [(814, 545), [(806, 541), (797, 555), (793, 572), (796, 588), (805, 598), (817, 601), (826, 594), (828, 578), (823, 556)], .85, .35, 12, .6],
    [(972, 668), [(976, 638), (986, 648), (992, 664), (991, 680), (984, 693), (973, 700)], 1.3, .5, 8, 2.0],
    [(853, 760), [(852, 749), (822, 756), (793, 763), (765, 770), (742, 777), (727, 785), (732, 792), (752, 794), (775, 796), (793, 800), (787, 815),
                  (780, 835), (773, 862), (783, 852), (797, 832), (815, 810), (834, 790), (853, 773), (862, 765)], 2.1, .6, 19, 1.2],
]
fins = [{'c': surf(c[0], c[1], dd), 'o': line(o, dd, True, 4), 't0': t0, 't1': t1, 'n': n} for c, o, t0, t1, n, dd in FINS]

design = {
    'crest': [[a, w, l, s, ti, to, line(p, 0, False, 5)] for a, w, l, s, ti, to, p in CREST],
    'groove': [[a, w, line(p, 0, False, 5)] for a, w, p in GROOVE],
    'ridge': [[a, w, line(p, 0, False, 6)] for a, w, p in RIDGE],
    'ring': [[a, w] + surf(x, y) + [round(r * K, 2)] for a, w, x, y, r in RING],
    'blob': [[a, w, line(p, 0, False, 1)] for a, w, p in BLOB],
    'carp': {'D': D, 'V': V, 'T': TH, 'eye': EYE, 'gill': GILL, 'mouth': MOUTH, 'nostril': NOSTRIL, 'fins': fins, 'mid': -.2, 'fin': [.44, .94]},
}
js = ('/* ---------- the design of the cast carp vessel (generated by bronze/mkcast.py from the tracing of its reference photograph): every point is\n'
      '   [angle round the axis in radians, 0 facing the eye and + to the right, height above the foot in units] ---------- */\n'
      'const CAST_DESIGNS={carpe:' + json.dumps(design, separators=(',', ':')) + '};\n')
open(r'C:/Users/agent/Desktop/flower/flower-atelier/app/v1h.js', 'w',
     encoding='utf-8', newline='\n').write(js)
print('design', len(js), 'chars')
print('prof', json.dumps(PROF, separators=(',', ':')))
open(r'C:/Users/agent/Desktop/flower/flower-atelier/bronze/prof.json', 'w').write(json.dumps(PROF))
print('carp D', D[:3], '... V', V[:3], 'eye', EYE)
print('carp span angle', min(p[0] for p in D + V), max(p[0] for p in D + V), 'height', min(p[1] for p in D + V), max(p[1] for p in D + V))
