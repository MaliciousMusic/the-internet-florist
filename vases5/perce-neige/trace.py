# The GLB's texture (shop view, texhd.py) vectorised as it is by vtracer: stacked colour areas, spline edges. No
# reinterpretation: the drawing, the tube lines and the washes are the texture's own. -> out/trace_<tag>.svg
#   .venv-depth/Scripts/python trace.py [tag] [key=value ...]  (vtracer settings: cp, ld, fs, ct, lt, sp)
import sys, os, gzip, time
import vtracer
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
A = sys.argv[1:]
tag = A[0] if A and '=' not in A[0] else 'a'
O = dict(a.split('=') for a in A if '=' in a)
g = lambda k, d: type(d)(O.get(k, d))
t0 = time.time()
src = os.path.join(OUT, 'tex_shop_hd.png'); dst = os.path.join(OUT, 'trace_%s.svg' % tag)
vtracer.convert_image_to_svg_py(src, dst, colormode='color', hierarchical='stacked', mode='spline',
                                filter_speckle=g('fs', 2), color_precision=g('cp', 7), layer_difference=g('ld', 6),
                                corner_threshold=g('ct', 60), length_threshold=g('lt', 3.5), max_iterations=10,
                                splice_threshold=g('sp', 45), path_precision=g('pp', 1))
s = open(dst, 'rb').read()
print('%s: %d paths, %.0f Ko, gzip %.0f Ko (%.1fs)' % (tag, s.count(b'<path'), len(s) / 1024, len(gzip.compress(s, 9)) / 1024, time.time() - t0))
