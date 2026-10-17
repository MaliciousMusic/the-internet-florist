# A static page of tour.py vases, without the engine or a server: each body.json drawn as it is (body over its mouth layer),
# for checking a render quickly.   python apercu_tours.py <id> [id ...]  ->  tours/_apercu.html
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
cells = []
for vid in sys.argv[1:]:
    d = json.load(open(os.path.join(HERE, 'tours', vid, 'out', 'body.json'), encoding='utf-8'))
    f = json.load(open(os.path.join(HERE, 'tours', vid, 'out', 'fiche.json'), encoding='utf-8'))
    h = float(f.get('h', 100)); r = max(q[1] for q in f.get('prof', [[0, 60]])) if f.get('prof') else 120
    if f.get('ol'):
        r = max(abs(q[0]) for q in f['ol']['pts'])
    vb = '%g %g %g %g' % (500 - r * 1.25, 990 - h * 1.15 - 20, r * 2.5, h * 1.15 + 40)
    import re
    tag = '_%d' % len(cells)
    fix = lambda t: re.sub(r'url\(#([\w-]+)\)', lambda m_: 'url(#' + m_.group(1) + tag + ')', re.sub(r'id="([\w-]+)"', lambda m_: 'id="' + m_.group(1) + tag + '"', t))
    d = {k: fix(x) if isinstance(x, str) else x for k, x in d.items()}
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s"><defs>%s</defs>%s%s</svg>' % (vb, d['defs'], d.get('mouth', ''), d['body'])
    cells.append('<figure><div>%s</div><figcaption>%s</figcaption></figure>' % (svg, vid))
open(os.path.join(HERE, 'tours', '_apercu.html'), 'w', encoding='utf-8').write(
    '<!doctype html><meta charset="utf-8"><title>Aperçu des vases</title><style>body{margin:0;background:#f3eee7;font:12px system-ui;display:flex;flex-wrap:wrap}'
    'figure{margin:8px;width:%dpx}figure svg{width:100%%;height:auto;max-height:1000px;display:block}</style>%s' % (int(1800 / max(1, len(cells))), ''.join(cells)))
print('tours/_apercu.html', len(cells))
