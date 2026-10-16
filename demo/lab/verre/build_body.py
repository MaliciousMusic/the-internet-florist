# Builds the shop's SVG body of the glass vase with dancers (mk2.py, shop projection) into app/v1i.js, and its catalogue entry
# (profile measured through the photograph's camera) into app/v0.js. Only numbers and SVG leave the atelier, never the photograph.
#   python build_body.py [--v0 ../app/v0.js] [mk2 key=value ...]
import sys, os, re, json, math, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(HERE)
ARGV = list(sys.argv)

PARAMS = ('amb=.27 diff=.75 glow=.55 thick=24 sheen=.06 specp=30 spec=.06 stk=.75 st0=.2 rim=.2 pitg=1.3 knee=210 '
          'grain=0 gr=180 gg=164 gb=140 gstain=.3 tgap=14 edgeb=.6 edged=.3 spark=.5 '
          'ramp=0 sss=0 fthin=229,231,233 fthick=241,238,231 shadowtint=.94,.975,1.035 transcol=228,228,226 '
          'bop=.25 bcol=196,186,168 fop=.35 gop=.55 lop=.56 fop2=.68 trans=.75 thmin=.55 '
          'refl=3 rt0=.22 rgam=1.2 boxw=.5 kbox=1 kstrip=1.3 stripw=.1 rblur=2.5 rbl=4.5 rdy=.1 r0=.05 rstep=10 ramin=150 '
          'dy=7 step=8 rdp=.8 gblur=6 stepg=12 dyg=11 amin=80 csm=1 blur=1.1 qs=.4').split()
extra = [a for a in sys.argv[1:] if '=' in a]
r = subprocess.run([sys.executable, 'mk2.py', 'shop'] + PARAMS + extra, capture_output=True, text=True)
print(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr[-800:])
svg = open('out/vase2_shop.svg').read()
defs = svg[svg.index('<defs>') + 6:svg.index('</defs>')]
body = svg[svg.index('<g id="vase">') + len('<g id="vase">'):svg.rindex('</g></svg>')]

# ---------------------------------------------------------------- profile of the turned body, in shop units (6.5 per cm)
sys.argv = ['mk2.py', 'shop']
import mk2  # noqa: E402
U = mk2.UPC
prof = []
for i in range(0, 50):
    h = 24.5 * i / 49
    if h <= mk2.mk.H_FOOT:
        rr = mk2.mk.R_FOOT
    elif h >= mk2.mk.H_BAND:
        rr = mk2.mk.R_LIP
    else:
        rr = max(mk2.mk.R_FOOT, mk2.r_surf(h))
    prof.append([round(h * U, 1), round(rr * U, 2)])
H = round(24.5 * U, 1)
VASE = {"id": "verre-danseuses", "refs": [], "n": "Vase en verre aux danseuses", "m": "verre moulé-pressé satiné, patine sépia",
        "fam": "vase", "shape": "lathe", "p": 0, "mat": "glass", "fin": "", "col": "#d3d3cf", "col2": None, "lip": "plain",
        "lipw": 3.6, "why": "Une ronde de danseuses en haut-relief dans un verre dépoli à peine teinté de sépia : un modèle de 1927, "
        "du domaine public, redessiné d'après ses volumes.", "prof": prof, "h": H, "mo": round((mk2.mk.R_LIP - .55) * U, 1),
        "sf": "none", "svgb": "danseuses"}

# ---------------------------------------------------------------- the inside of the mouth: frosted glass seen from above,
# the inner face of the back lip band, then the backs of the far dancers' heads glowing amber through the wall
ir = VASE['mo']; lw = max(1.1, min(VASE['lipw'], prof[-1][1] * .14)); ir = prof[-1][1] - lw
iry = max(2.5, prof[-1][1] * .16) * ir / prof[-1][1]
top = 990 - H
band = 1.73 * U
heads = ''
for i, (u, s) in enumerate(((-.78, .7), (-.42, 1), (-.05, .95), (.33, 1), (.7, .75))):
    cx = 500 + u * ir; cy = top - iry + band + 5.5; rx = 7.5 * s; ry = 4.2
    heads += '<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f"/>' % (cx, cy, rx, ry)
    heads += '<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f"/>' % (cx + 2 * (1 if u < 0 else -1), cy + 6, rx * .8, ry * 1.4)
mouth = ('<defs><linearGradient id="mi" gradientUnits="userSpaceOnUse" x1="0" y1="%.1f" x2="0" y2="%.1f">'
         '<stop offset="0" stop-color="#eceae6"/><stop offset=".12" stop-color="#d2d3d0"/><stop offset=".55" stop-color="#c8c8c3"/>'
         '<stop offset=".62" stop-color="#cfc6b6"/><stop offset="1" stop-color="#d9d0bf"/></linearGradient>'
         '<clipPath id="mc"><ellipse cx="500" cy="%.1f" rx="%.1f" ry="%.1f"/></clipPath>'
         '<filter id="mb" x="-20%%" y="-20%%" width="140%%" height="140%%"><feGaussianBlur stdDeviation="1.6"/></filter></defs>'
         '<g clip-path="url(#mc)"><rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="url(#mi)"/>'
         '<g fill="#a88a64" fill-opacity=".32" filter="url(#mb)">%s</g></g>') % (
    top - iry, top + iry, top, ir, iry, 500 - ir, top - iry, 2 * ir, 2 * iry, heads)

# ---------------------------------------------------------------- the cavity: where the stems inside can be seen (inside the walls,
# above the thick glass bottom), as the shop draws it (orthographic, the mouth seen from a little above)
RYS = .16
hb = mk2.mk.H_FOOT + 1.1                               # the glass bottom is about 1.1 cm thick above the foot ring
def r_in(h):
    if h >= mk2.mk.H_BAND:
        return mk2.mk.R_LIP - .55
    return max(1.0, mk2.r_surf(h) - .6 - .45)
hs = [hb + (24.5 - hb) * i / 40 for i in range(41)]
left = [(500 - r_in(h) * U, 990 - h * U) for h in hs]
right = [(500 + r_in(h) * U, 990 - h * U) for h in hs][::-1]
rb_ = r_in(hb) * U
bottom = [(500 + rb_ * math.cos(math.pi * k / 16), 990 - hb * U + rb_ * RYS * math.sin(math.pi * k / 16)) for k in range(17)]
rt_ = r_in(24.4) * U
toparc = [(500 - rt_ * math.cos(math.pi * k / 16), 990 - 24.5 * U - rt_ * RYS * math.sin(math.pi * k / 16)) for k in range(17)]
inner = 'M' + 'L'.join('%.1f,%.1f' % p for p in bottom + left[1:-1] + toparc + right[1:-1]) + 'Z'
cavb = round(990 - hb * U + rb_ * RYS * .6, 1)

NL = chr(10)
JS_FUN = r"""let svgbN=0;
/* a drawing given as SVG text, its ids made unique for this copy (several vessels may share a page) */
function svgbPut(g,txt,tag){const k='_'+tag+(svgbN++).toString(36),
  fix=s=>s.replace(/id="([\w-]+)"/g,(m,a)=>'id="'+a+k+'"').replace(/url\(#([\w-]+)\)/g,(m,a)=>'url(#'+a+k+')');
  const w=G(g,{'data-svgb':tag});w.innerHTML=fix(txt);return w}
function svgBody(g,v){const b=SVGB[v.svgb];if(!b)return vBody(g,v,profSamples(v.prof,LOD?28:90));return svgbPut(g,'<defs>'+b.defs+'</defs>'+b.body,v.svgb)}
/* the inside of the mouth, over the plain one, inside the rim */
function svgMouth(g,v){const b=SVGB[v.svgb];if(b&&b.mouth)svgbPut(g,b.mouth,'m')}
"""
js = ('/* ---------- the drawn bodies of the sculpted vessels (generated by verre/build_body.py from the structure of their model:' + NL +
      '   normals, depths and the isolated figures, lit by the shop light and written as curves) ---------- */' + NL +
      'const SVGB={danseuses:' + json.dumps({'defs': defs, 'body': body, 'mouth': mouth, 'inner': inner, 'cavb': cavb, 'cavr': round(rb_, 1)}, ensure_ascii=False, separators=(',', ':')) + '};' + NL +
      JS_FUN)
open(os.path.join(HERE, '..', 'app', 'v1i.js'), 'w', encoding='utf-8', newline=NL).write(js)
print('v1i.js', len(js), 'octets')


def put_entry(path, v):
    """the entry written into VZ0: replaced where it stands, or added at the end; every other byte of the file is kept"""
    t = open(path, encoding='utf-8').read()
    ent = json.dumps(v, ensure_ascii=False, separators=(',', ':'))
    a = t.find('{"id":"%s"' % v['id'])
    if a >= 0:
        depth, i, instr = 0, a, False
        while True:
            ch = t[i]
            if instr:
                if ch == chr(92): i += 1
                elif ch == '"': instr = False
            elif ch == '"': instr = True
            elif ch == '{': depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0: break
            i += 1
        t = t[:a] + ent + t[i + 1:]
    else:
        start = t.index('const VZ0=[')
        end = t.index('];', start)
        t = t[:end] + ',' + ent + t[end:]
    open(path, 'w', encoding='utf-8', newline=chr(10)).write(t)


if '--v0' in ARGV:
    put_entry(os.path.join(HERE, '..', 'app', 'v0.js'), VASE)
    print('fiche', VASE['id'])
json.dump(VASE, open('out/fiche.json', 'w', encoding='utf-8'), ensure_ascii=False)
