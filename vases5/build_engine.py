# Puts the five vases of 2026-10-16 into the engine: every <vase>/out/body.json becomes an entry of SVGB in app/v1j.js (after
# v1i.js, which holds the glass dancers), and every <vase>/out/fiche.json is written into VZ0 in app/v0.js (replaced where it
# stands, or added at the end). Only numbers and curves leave the workshops, never a photograph.
#   python build_engine.py [vase ...]      (all five by default; a vase without its out/ files is skipped)
import sys, os, json, re
HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(HERE, '..', 'app')
VASES = ['coque-verte', 'carpes-dorees', 'torsade-turquoise', 'ginkgo', 'prisme-jaune', 'perce-neige']
sys.path.insert(0, os.path.join(HERE, '..', 'verre'))


CLEAR = {'prisme-jaune'}
OPT_SOVER = {'cristal-violet': .5}                              # glass whose painting hides the stems inside
# vases drawn from their GLB (glbsvg.py, verrelys.py): the mouth and lip are part of the drawing, the engine adds none
GLB_OWN = {'chauve-souris', 'dragon-turquoise', 'papillon-rose', 'calla-verte', 'bambou-brun', 'lys-mauves', 'cristal-violet',
           'jardiniere-cristaux', 'prismes-bronze', 'narcisses-bronze', 'coque-verte', 'gui-argent', 'feuilles-vertes',
           'dragon-cloisonne', 'ronces-noires', 'colonne-art-nouveau'}                                                 # clear, unfrosted glass


def half_width(P, h):
    """half of the widest horizontal span of the closed outline P at height h"""
    xs = []
    for (x0, y0), (x1, y1) in zip(P, P[1:] + P[:1]):
        if (y0 - h) * (y1 - h) <= 0 and y0 != y1:
            xs.append(x0 + (x1 - x0) * (h - y0) / (y1 - y0))
    return max(1.0, (max(xs) - min(xs)) / 2) if len(xs) >= 2 else 1.0


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
    open(path, 'w', encoding='utf-8', newline='\n').write(t)


def add_hole(body, fiche, cfg, m=None, tag='h'):
    """a model whose opening is only a shallow scoop (Meshy closed it): a real opening on the measured mouth, shaped like the
    photograph's (a crescent of shadow under the notch of the lip, rising along the lip towards the far end). Its inside is drawn
    over the body behind the stems (mouth); the part of it below the mouth's axis is cut out of the front (fr, even-odd), so the
    stems are seen going down into it; the front lip, a soft light edge, is part of the body"""
    VX_, FL_ = 500, 990
    m = m or fiche                                          # the main mouth, or another one (m2)
    cx, cy, rx, ry = VX_ + m['mx'], FL_ - m['mh'], m['mo'], m['mry']
    f = lambda v: ('%.2f' % v).rstrip('0').rstrip('.')
    dark, wall, rim = cfg.get('hole_dark', '#0b100d'), cfg.get('hole_wall', '#1d2620'), cfg.get('hole_rim', '#6f8272')
    lift = float(cfg.get('hole_rise', 2.6)) * ry           # the far end of the lip stands higher (the lip rises along the cup)
    sag, top = float(cfg.get('hole_sag', 2.0)) * ry, float(cfg.get('hole_top', 1.3)) * ry
    L, R = (cx - rx, cy - .4 * ry), (cx + rx, cy - lift)
    low = (L, (cx - .55 * rx, cy + sag), (cx + .45 * rx, cy + sag * 1.05), R)          # the front lip
    up = (R, (cx + .35 * rx, cy - top - lift * .3), (cx - .5 * rx, cy - top), L)        # the far edge of the shadow
    cub = lambda c: 'C%s %s %s %s %s %s' % tuple(f(v) for q in c[1:] for v in q)
    hole = 'M%s %s%s%sZ' % (f(L[0]), f(L[1]), cub(low), cub(up))
    def bez(c, t):
        u = 1 - t
        return [u**3 * c[0][i] + 3 * u * u * t * c[1][i] + 3 * u * t * t * c[2][i] + t**3 * c[3][i] for i in (0, 1)]
    below = [q for q in (bez(low, i / 60) for i in range(61)) if q[1] > cy]
    if below:
        cut = 'M%s %s' % (f(below[0][0]), f(cy)) + ''.join('L%s %s' % (f(x), f(y)) for x, y in below) + 'L%s %sZ' % (f(below[-1][0]), f(cy))
        body['fr'] = body['fr'] + cut
    grad = ('<linearGradient id="{t}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{w}"/><stop offset=".5" stop-color="{d}"/>'
            '<stop offset="1" stop-color="{d}"/></linearGradient>').format(t=tag, w=wall, d=dark)
    blur = '<filter id="{t}gb" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="{s}"/></filter>'.format(t=tag, s=f(ry * .35))
    body['mouth'] = body.get('mouth', '') + ('<defs>{g}{b}</defs><path d="{h}" fill="url(#{t}g)"/><path d="{h}" fill="{d}" filter="url(#{t}gb)" opacity=".8"/>'
                                             .format(g=grad, b=blur, h=hole, t=tag, d=dark))
    lipd = 'M%s %s%s' % (f(L[0]), f(L[1]), cub(low))
    body['body'] += ('<path d="%s" fill="none" stroke="%s" stroke-width="%s" stroke-opacity=".55" stroke-linecap="round" transform="translate(0 %s)"/>' % (
                         lipd, rim, f(float(cfg.get('hole_lip', 1.2))), f(.45)))


def main():
    want = [a for a in sys.argv[1:] if not a.startswith('-')] or VASES
    entries = {}
    # entries already in v1j.js are kept when their workshop is not rebuilt this time
    pj = os.path.join(APP, 'v1j.js')
    if os.path.exists(pj):
        m = re.search(r'Object\.assign\(SVGB,(\{.*\})\);', open(pj, encoding='utf-8').read(), re.S)
        if m:
            entries = json.loads(m.group(1))
    for name in want:
        ob, of = (os.path.join(HERE, name, 'out', f) for f in ('body.json', 'fiche.json'))
        if not (os.path.exists(ob) and os.path.exists(of)):
            print('skip', name)
            continue
        body = json.load(open(ob, encoding='utf-8'))
        fiche = json.load(open(of, encoding='utf-8'))
        key = fiche.get('svgb') or name
        if fiche.get('shape') == 'outline':
            P = [[x, max(0.0, y)] for x, y in fiche['ol']['pts']]       # nothing below the floor
            fiche['ol']['pts'] = P
            if not fiche.get('prof'):                                   # the stems inside need a profile: half widths of the outline
                fiche['prof'] = [[round(fiche['h'] * i / 24, 1), round(half_width(P, fiche['h'] * i / 24), 1)] for i in range(25)]
        oc = os.path.join(HERE, name, 'out', 'compo.json')
        if os.path.exists(oc):
            # where the bouquet goes, measured on the model (compo.py): the real mouth, the true top column by column, the front
            # drawn over the stems, the window or cavity where the stems inside are seen
            cp = json.load(open(oc, encoding='utf-8'))
            for kk in ('mx', 'mh', 'mo', 'mry'):
                fiche[kk] = cp[kk]
            fiche['sil'] = cp['st']                                     # (st is the stage, the plinth)
            if fiche.get('mat') != 'glass':
                body['fr'] = cp['fr']
            for kk in ('inner', 'cavb', 'cavr', 'clear'):
                if kk in cp:
                    body[kk] = cp[kk]
            if fiche.get('mat') == 'glass' and 'inner' in cp:
                body['clear'] = 1
                body['sover'] = float(OPT_SOVER.get(name, .5))           # its painted glass covers them: drawn over it, faded
        if name in CLEAR:
            body['clear'] = 1                                           # clear glass: the stems inside are seen sharp
        cfg = os.path.join(HERE, name, 'glbsvg.json')
        if os.path.exists(cfg) and json.load(open(cfg, encoding='cp1252')).get('bq'):
            fiche['bq'] = float(json.load(open(cfg, encoding='cp1252'))['bq'])     # a larger bouquet for a wide opening
        if os.path.exists(cfg):
            m2 = json.load(open(cfg, encoding='cp1252')).get('m2')
            if m2:                                                      # the vessel's other mouths, each with its share of the stems
                fiche['m2'] = [dict(mx=q[0], mh=q[1], mo=q[2], mry=q[3], k=q[4], front=int(len(q) > 5 and bool(q[5]))) for q in m2]
        if os.path.exists(oc) and os.path.exists(cfg) and str(json.load(open(cfg, encoding='cp1252')).get('hole', '0')) != '0':
            cf = json.load(open(cfg, encoding='cp1252'))
            add_hole(body, fiche, cf)
            for j, mm in enumerate(fiche.get('m2', [])):
                add_hole(body, fiche, cf, mm, 'h%d' % (j + 2))
        fiche['svgb'] = key
        body['own'] = 1 if (body.get('mouth') or name in GLB_OWN) else 0          # a vessel with its own mouth draws its own lip too
        entries[key] = body
        put_entry(os.path.join(APP, 'v0.js'), fiche)
        print('%-18s %-12s body %6.1f Ko  %s' % (name, key, len(json.dumps(body)) / 1024, fiche['id']))
    js = ('/* ---------- the five sculpted vessels of 2026-10-16 (generated by vases5/build_engine.py from each workshop: a model of the' + '\n'
          '   vessel lit by the shop light and written as curves) ---------- */' + '\n'
          'Object.assign(SVGB,' + json.dumps(entries, ensure_ascii=False, separators=(',', ':')) + ');' + '\n')
    open(pj, 'w', encoding='utf-8', newline='\n').write(js)
    print('v1j.js %.1f Ko, %d vases' % (len(js) / 1024, len(entries)))


if __name__ == '__main__':
    main()
