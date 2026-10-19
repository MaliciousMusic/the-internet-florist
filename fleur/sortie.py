"""sortie.py: the exit checklist of one flower sort (BONNES-PRATIQUES §15; owner, 2026-10-19: « je veux que toutes les bonnes pratiques et
trucs à checker soient checkés, je serai intransigeant »). Each point of the protocol must have left its proof on disk and that proof must pass;
a sort is not shown as finished, nor merged, nor published while one point is MANQUE. pipe.py runs it as its last step (sortie), the lab
dashboard shows its lights (refcache/<sid>/sortie.json).

  python fleur/sortie.py <sid> --cws <catalogue colourway ids> [--mesurer] [--banc] [--json]

  --mesurer  makes the automatic proofs first: the holes sheet (a grid on a green ground, fleur/trous.py), the witnesses (tm_ / tn_);
  --banc     also runs the 3D bench (fleur/banc3d.js, every stage, 6 seeds, views 0,2,7, heart included): long (an hour or more)
  --json     writes refcache/<sid>/sortie.json (the lab dashboard reads it)

The points and their proofs (refcache/<sid>/; photos stay in refcache, never committed):
  1 sources      coloris-photos.json: a named photo for every colourway; photos of faded flowers (fane/ or the registry)
  2 fiche        catalogue/serre/fiches/<sid>.json read before drawing: organs, the layer structure (insertion, profondeur_gorge), check clean
  3 piece        apparence/<cw>/<cw>-*.json: the piece measured on the photo of each colourway (apparence.py piece)
  4 grille       apparence/grille-<cw>.json (or apparence/coloris/) per colourway, its cells in the code: no hand ramp where a photo exists
  5 composantes  coeur.json: each component (anther, pollen, filament, style, stigma, throat, spots...) its photo colour and its code colour,
                 ΔE2000 <= 6 between them
  6 profondeur   volume/*.txt (volume.py paire, same angle): H/W, fill, funnel depth, width profile all ok (3D dimension, depth of the centre)
  7 couleurs     apparence/<cw>/*paire*.txt per colourway (apparence.py paire, photo | render): no region ko (ΔE2000 > 6)
  8 matiere      the same tables: contrast and grain (render / photo) 0.7 to 1.4 in every region: gloss / matte, smooth / grained
  9 lumiere      the same tables: light along the axis and across (L*), mean gap <= 6: the transitions from throat to tip, axis to margin
  10 stades      comparaison/stades*.jpg (bud to faded) and comparaison/fane*.jpg (the faded against photos of faded flowers)
  11 couches     banc3d.txt (fleur/banc3d.js): every stage, >= 6 seeds, heart included, totals 0 (no piece through another, layers in order)
  12 trous       trous.json (fleur/trous.py on the green sheet): worst cell <= 0.5 % (nothing seen through the flower)
  13 temoins     temoins.txt: the witness sorts identical to the pixel after the last engine change
  14 plante      comparaison/plante*.jpg: stem, leaves with their grid, buds against a photo of the plant
"""
import sys, os, json, glob, re, subprocess, argparse

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WITNESS = ['gloriosa', 'nerine', 'anemone-coronaria', 'tulipe-simple', 'cymbidium-grandes-fleurs', 'oeillet-standard']
STAGES = '.06:0,.2:0,.4:0,.6:0,.8:0,1:0,1:.4,1:.7,1:1'


def js(p):
    try:
        return json.load(open(p, encoding='utf-8'))
    except Exception:
        return None


def txt(p):
    try:
        return open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        return ''


def de2000(a, b):
    import numpy as np
    from skimage import color
    rgb = lambda h: np.array([[[int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)]]]) / 255.0
    return float(color.deltaE_ciede2000(color.rgb2lab(rgb(a)), color.rgb2lab(rgb(b)))[0, 0])


def catalogue_cws(sid):
    """the colourway ids of the sort in the catalogue: CWS['<sid>'] (or "'<sid>':CW_X" in an Object.assign(CWS,...)) -> the table CW_X's ids"""
    code = ' '.join(txt(p) for p in sorted(glob.glob(os.path.join(ROOT, 'app', '*.js'))))
    names = re.findall(r"CWS\[['\"]%s['\"]\]\s*=\s*([A-Z_0-9]+)" % re.escape(sid), code) + re.findall(r"Object\.assign\(CWS,\{[^}]*?['\"]%s['\"]\s*:\s*([A-Z_0-9]+)" % re.escape(sid), code)
    for nm in names[::-1]:
        m = re.search(r'(?:const|let|var)\s+%s\s*=\s*\[(.*?)\];' % nm, code, re.S)
        if m:
            ids = re.findall(r"\{\s*id\s*:\s*'([^']+)'", m.group(1))
            if ids:
                return ids
    return []


def mesurer(sid, cws, R, banc):
    sh = lambda name, q: subprocess.run(['sh', 'fleur/shot_p.sh', name, q], cwd=ROOT, capture_output=True, text=True)
    # the holes: a grid on a green ground, every stage, views 0,2,7
    st = STAGES.split(',')
    sh('trous_' + sid, 'grid=1&sid=%s&cws=%s&st=%s&view=0,2,7&D=200&det=2&seed=7&nohrt=1&bg=%%2300ff00' % (sid, ','.join(cws), STAGES))  # the tissue's holes: a heart's filaments arcing out enclose real gaps, not holes
    png = os.path.join(ROOT, 'fleur', 'out', 'trous_%s.png' % sid)
    if os.path.exists(png):
        sys.path.insert(0, os.path.join(ROOT, 'fleur'))
        import trous
        cells = trous.measure(png, len(st), len(cws) * 3)
        worst = max(((c['holes'] / max(1, c['flower'] + c['holes'])), r, k) for r, row in enumerate(cells) for k, c in enumerate(row))
        json.dump(dict(worst=round(100 * worst[0], 3), cell=[worst[1], worst[2]], stages=st, cws=cws), open(os.path.join(R, 'trous.json'), 'w', encoding='utf-8'))
    # the witnesses
    lines = []
    from PIL import Image, ImageChops
    import numpy as np
    for w in WITNESS:
        tm = os.path.join(ROOT, 'fleur', 'out', 'tm_%s.png' % w)
        if not os.path.exists(tm):
            lines.append('%s : pas de référence tm_ (à faire avant tout changement du moteur)' % w)
            continue
        sh('tn_' + w, 'grid=1&sid=%s&st=1:0&view=0,2&D=300&det=2&seed=7' % w)
        a = Image.open(tm).convert('RGB')
        b = Image.open(os.path.join(ROOT, 'fleur', 'out', 'tn_%s.png' % w)).convert('RGB')
        n = -1 if a.size != b.size else int((np.asarray(ImageChops.difference(a, b)).max(2) > 0).sum())
        lines.append('%s : %s' % (w, 'identique' if n == 0 else 'DIFF %s px' % n))
    open(os.path.join(R, 'temoins.txt'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    if banc:
        r = subprocess.run(['node', '--max-old-space-size=900', 'fleur/banc3d.js', '--head', "SV_HEAD['%s']({},B,O,200,CW,OP,SD,WL)" % sid, '--cws', ','.join(cws),
                            '--seeds', '1,2,3,4,5,6,14,21'], cwd=ROOT, capture_output=True, text=True)
        open(os.path.join(R, 'banc3d.txt'), 'w', encoding='utf-8').write(r.stdout)


def main():
    a = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    a.add_argument('sid')
    a.add_argument('--cws', help='the colourway ids of the catalogue (default: read from CWS[sid] in app/*.js)')
    a.add_argument('--mesurer', action='store_true')
    a.add_argument('--banc', action='store_true')
    a.add_argument('--json', action='store_true')
    o = a.parse_args()
    sid = o.sid
    cws = o.cws.split(',') if o.cws else catalogue_cws(sid)
    if not cws:
        print('coloris du catalogue introuvables pour %s : donner --cws' % sid)
        sys.exit(2)
    R = os.path.join(ROOT, 'refcache', sid)
    os.makedirs(R, exist_ok=True)
    if o.mesurer:
        mesurer(sid, cws, R, o.banc)
    out = []
    line = lambda k, ok, why: out.append((k, bool(ok), why))
    # 1 sources
    cp = js(os.path.join(R, 'coloris-photos.json')) or {}
    miss = [c for c in cws if not cp.get(c)]
    reg = ' '.join(txt(p) for p in glob.glob(os.path.join(R, 'keep*.json')) + [os.path.join(R, 'refs-vus.json')])
    fane = bool(glob.glob(os.path.join(R, 'fane', '*'))) or bool(re.search(r'fan[eé]', reg))
    line('1 sources', not miss and fane, ('sans photo nommée : ' + ', '.join(miss) if miss else 'une photo nommée par coloris') + ('' if fane else ' ; aucune photo de fané'))
    # 2 fiche
    f = js(os.path.join(ROOT, 'catalogue', 'serre', 'fiches', sid + '.json'))
    ft = json.dumps(f, ensure_ascii=False) if f else ''
    struct = all(k in ft for k in ('insertion', 'profondeur_gorge'))
    chk = ''
    if f:
        r = subprocess.run([sys.executable, os.path.join(ROOT, 'fleur', 'fiche.py'), 'check', sid, '--quiet'], capture_output=True, text=True, cwd=ROOT)
        chk = (r.stdout + r.stderr).strip()
    bad_f = bool(f) and ('NON VALIDE' in chk or '"valide": false' in chk)
    line('2 fiche', f and struct and not bad_f, 'absente' if not f else ('structure des couches absente (insertion, profondeur_gorge)' if not struct else ('fiche.py check : non valide' if bad_f else 'valide, structure des couches présente')))
    # 3 piece, 4 grille
    code = ' '.join(txt(p) for p in glob.glob(os.path.join(ROOT, 'app', '*.js')))
    np_, ng = [], []
    for c in cws:
        if not (glob.glob(os.path.join(R, 'apparence', c, c + '-*.json')) or glob.glob(os.path.join(R, 'apparence', '*', c + '-*.json'))):
            np_.append(c)
        g = js(os.path.join(R, 'apparence', 'grille-%s.json' % c)) or js(os.path.join(R, 'apparence', 'coloris', 'grille-%s.json' % c))
        if not g or g['c'][0][0] not in code or g['c'][-1][-1] not in code:
            ng.append(c)
    line('3 piece', not np_, 'non mesurée : ' + ', '.join(np_) if np_ else 'mesurée sur chaque coloris')
    line('4 grille', not ng, 'grille absente ou hors du code : ' + ', '.join(ng) if ng else 'une grille mesurée par coloris, dans le code')
    # 5 composantes
    h = js(os.path.join(R, 'coeur.json')) or {}
    bad, nm = [], 0
    for k, v in h.items():
        if not isinstance(v, dict):
            continue
        ph, cd = v.get('photo') or {}, v.get('code') or {}
        if not ph or not cd:
            bad.append(k + ' (photo ou code manquant)')
            continue
        for cw_, hx in ph.items():
            if cw_ in cd:
                nm += 1
                d = de2000(hx, cd[cw_])
                if d > 6:
                    bad.append('%s/%s ΔE %.1f' % (k, cw_, d))
    # the heart's parts are measured on every colourway's photo, not once for the sort (owner, 2026-10-19: green filaments on an orange LA)
    for k in ('anthere', 'filet', 'style', 'stigmate'):
        miss = [c for c in cws if c not in ((h.get(k) or {}).get('photo') or {})]
        if h and miss:
            bad.append('%s non mesuré : %s' % (k, ', '.join(miss)))
    line('5 composantes', len(h) >= 4 and nm > 0 and not bad, 'coeur.json absent' if not h else ('; '.join(bad[:6]) if bad else '%d composants, %d couleurs photo = code' % (len(h), nm)))
    # 6 profondeur
    vt = glob.glob(os.path.join(R, 'volume', '*.txt'))
    VBAD = r'\| (trop (?:haut|bas|profond|plat)|écart [0-9.]+) \|'  # a verdict cell, not the column's label
    vb = [os.path.basename(p) + ' : ' + ', '.join(sorted(set(re.findall(VBAD, txt(p))))) for p in vt if re.search(VBAD, txt(p))]
    line('6 profondeur', vt and not vb, 'aucune comparaison de profil' if not vt else ('; '.join(vb) if vb else 'profil conforme (%d vues)' % len(vt)))
    # 7, 8, 9 from the paire tables
    ko, mat, lum, nt = [], [], [], {}
    for c in cws:
        T = glob.glob(os.path.join(R, 'apparence', c, '*paire*.txt')) + glob.glob(os.path.join(R, 'apparence', c + '-paire*.txt'))
        nt[c] = len(T)
        for p in T:
            t = txt(p)
            for row in re.findall(r'^\| (\S+) \| ([0-9.]+) \| [^|]+ \| ([0-9.]+) \| ([0-9.]+) \| ([^|]+) \|', t, re.M):
                reg_, de, ct, gr, vd = row
                if float(de) > 6:
                    ko.append('%s %s ΔE %s' % (c, reg_, de))
                if not (.7 <= float(ct) <= 1.4 and .7 <= float(gr) <= 1.4):
                    mat.append('%s %s %s/%s' % (c, reg_, ct, gr))
            m = re.search(r'axe[^;]*; écart moyen ([0-9.]+)', t)
            if m and float(m.group(1)) > 6:
                lum.append('%s %s' % (c, m.group(1)))
    nopair = [c for c in cws if not nt[c]]
    line('7 couleurs', not nopair and not ko, ('sans tableau photo | rendu : ' + ', '.join(nopair) + ' ; ' if nopair else '') + ('%d régions ko : ' % len(ko) + '; '.join(ko[:4]) if ko else ('' if nopair else 'aucune région ko')))
    line('8 matiere', not nopair and not mat, ('sans tableau' if nopair else '') + (' ; %d régions hors 0.7-1.4 (brillance, grain) : ' % len(mat) + '; '.join(mat[:3]) if mat else ''))
    line('9 lumiere', not nopair and not lum, ('sans tableau' if nopair else '') + (' ; écart de lumière le long de l\'axe > 6 L* : ' + '; '.join(lum) if lum else ''))
    # 10 stades
    st, fa = glob.glob(os.path.join(R, 'comparaison', 'stades*.jpg')), glob.glob(os.path.join(R, 'comparaison', 'fane*.jpg'))
    line('10 stades', st and fa, ('' if st else 'planche des stades absente ; ') + ('' if fa else 'fané non comparé aux photos de fané'))
    # 11 couches
    t = txt(os.path.join(R, 'banc3d.txt'))
    tot = [float(x) for x in re.findall(r'^total \S+ ([0-9.]+)', t, re.M)]
    seeds = max((len(l.split()) - 1 for l in t.splitlines() if re.match(r'^[0-9.]+:[0-9.]+', l)), default=0)
    line('11 couches', tot and max(tot) == 0 and seeds >= 6, 'banc3d.txt absent (sortie.py --mesurer --banc)' if not t else 'totaux %s sur %d graines' % (tot, seeds))
    # 12 trous
    tr = js(os.path.join(R, 'trous.json'))
    line('12 trous', tr and tr['worst'] <= .5, 'trous.json absent (sortie.py --mesurer)' if not tr else 'pire case %.2f %%' % tr['worst'])
    # 13 temoins
    tt = txt(os.path.join(R, 'temoins.txt'))
    line('13 temoins', tt and 'DIFF' not in tt and 'pas de référence' not in tt, 'temoins.txt absent (sortie.py --mesurer)' if not tt else ('; '.join(l for l in tt.splitlines() if 'identique' not in l)[:160] or 'identiques au pixel'))
    # 14 plante
    line('14 plante', glob.glob(os.path.join(R, 'comparaison', 'plante*.jpg')), 'plante non comparée' if not glob.glob(os.path.join(R, 'comparaison', 'plante*.jpg')) else 'plante comparée')
    n = sum(0 if ok else 1 for _, ok, _ in out)
    print('Liste de sortie de %s (%s)' % (sid, ', '.join(cws)))
    for k, ok, why in out:
        print('  %-13s %-7s %s' % (k, 'OK' if ok else 'MANQUE', why))
    print('  => %s' % ('finie' if n == 0 else '%d point(s) manquant(s) : la sorte n\'est pas finie' % n))
    if o.json:
        import datetime
        json.dump(dict(sid=sid, cws=cws, quand=datetime.datetime.now().isoformat(timespec='seconds'), finie=n == 0,
                       points=[dict(k=k, ok=ok, why=why) for k, ok, why in out]), open(os.path.join(R, 'sortie.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    sys.exit(0 if n == 0 else 1)


if __name__ == '__main__':
    main()
