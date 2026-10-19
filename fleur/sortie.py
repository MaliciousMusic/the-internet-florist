"""sortie.py: the exit checklist of one flower sort (BONNES-PRATIQUES §15, owner 2026-10-19: « every new render must have ALL our good
practices »). It checks that each step of the protocol left its proof on disk, and says what is missing. A sort is not shown as finished, nor
merged, while a line is MANQUE. No model, no browser.

  python fleur/sortie.py <sid> [--cws a,b,c]        (default colourways: those of coloris-photos.json, else of coloris.json)

Proofs (refcache/<sid>/ unless said; photos stay in refcache, never committed):
  1 sources    coloris-photos.json: every colourway has a named photo; the photo registry (keep.json/kept) has a faded photo
  2 fiche      catalogue/serre/fiches/<sid>.json: organs listed, the layer structure (disposition: insertion, decalage_deg, profondeur_gorge)
               filled, `fleur/fiche.py check` clean
  3 piece      apparence/<cw>/*.json, apparence/<cw>-*.json or apparence/*/<cw>-*.json: the tepal/petal measured on the photo of each
               colourway (apparence.py piece; name the outputs after the colourway)
  4 grille     apparence/grille-<cw>.json for each colourway, and the grid used in the code (its first cell found in app/*.js)
  5 coeur      coeur.json: each heart component (anther, pollen, filament, style, stigma, throat, spots...) with its measured colour and the photo
  6 volume     volume/*.txt: the profile at equal angle (fleur/volume.py paire), its verdicts ok
  7 compare    comparaison/<cw>*.jpg (photo | render, same angle) for each colourway, and apparence/*paire*.txt or *.txt tables (apparence.py paire)
  8 stades     comparaison/stades*.jpg (bud to faded) and comparaison/fane*.jpg (the faded against photos of faded flowers)
  9 x3d        banc3d.txt: the output of fleur/banc3d.js over every stage, >= 6 seeds, views 0,2,7, heart included: its totals all 0
  10 temoins   temoins.txt: the witness sorts identical to the pixel after the last engine change
  11 plante    comparaison/plante*.jpg: stem, leaves (with their grid), buds against a photo of the plant
"""
import sys, os, json, glob, re, subprocess, argparse

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    a = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    a.add_argument('sid')
    a.add_argument('--cws')
    o = a.parse_args()
    sid = o.sid
    R = os.path.join(ROOT, 'refcache', sid)
    out = []

    def line(k, ok, why):
        out.append((k, ok, why))

    def js(p):
        try:
            return json.load(open(p, encoding='utf-8'))
        except Exception:
            return None

    cp = js(os.path.join(R, 'coloris-photos.json')) or {}
    cj = js(os.path.join(R, 'coloris.json')) or []
    cj = cj.get('coloris', []) if isinstance(cj, dict) else cj
    cws = o.cws.split(',') if o.cws else (list(cp.keys()) or [c.get('id') for c in cj if isinstance(c, dict) and c.get('id')])
    # 1 sources
    miss = [c for c in cws if not cp.get(c)]
    reg = ' '.join(open(p, encoding='utf-8', errors='replace').read() for p in glob.glob(os.path.join(R, 'keep*.json')) + glob.glob(os.path.join(R, 'refs-vus.json')))
    fane = bool(glob.glob(os.path.join(R, 'fane', '*'))) or bool(re.search(r'fan[eé]', reg))
    line('1 sources', bool(cws) and not miss and fane, ('coloris sans photo nommée : ' + ', '.join(miss) if miss else 'photos nommées pour %d coloris' % len(cws)) + ('' if fane else ' ; aucune photo de fané'))
    # 2 fiche
    fp = os.path.join(ROOT, 'catalogue', 'serre', 'fiches', sid + '.json')
    f = js(fp)
    txt = json.dumps(f, ensure_ascii=False) if f else ''
    struct = all(k in txt for k in ('insertion', 'profondeur_gorge'))
    chk = ''
    if f:
        r = subprocess.run([sys.executable, os.path.join(ROOT, 'fleur', 'fiche.py'), 'check', sid, '--quiet'], capture_output=True, text=True, cwd=ROOT)
        chk = (r.stdout + r.stderr).strip()
    line('2 fiche', bool(f) and struct and not re.search(r'erreur|error', chk, re.I), 'absente' if not f else ('structure des couches absente (insertion, profondeur_gorge)' if not struct else ('check : ' + chk[:120] if chk else 'complète')))
    # 3 piece and 4 grille
    code = ' '.join(open(p, encoding='utf-8', errors='replace').read() for p in glob.glob(os.path.join(ROOT, 'app', '*.js')))
    np_, ng = [], []
    for c in cws:
        if not (glob.glob(os.path.join(R, 'apparence', c, '*.json')) or glob.glob(os.path.join(R, 'apparence', c + '-*.json')) or glob.glob(os.path.join(R, 'apparence', '*', c + '-*.json'))):
            np_.append(c)
        g = js(os.path.join(R, 'apparence', 'grille-%s.json' % c)) or js(os.path.join(R, 'apparence', 'coloris', 'grille-%s.json' % c))
        if not g or g['c'][0][0] not in code:
            ng.append(c)
    line('3 piece', bool(cws) and not np_, 'pièce non mesurée : ' + ', '.join(np_) if np_ else 'mesurée sur chaque coloris')
    line('4 grille', bool(cws) and not ng, 'grille absente ou non utilisée : ' + ', '.join(ng) if ng else 'une grille mesurée par coloris, dans le code')
    # 5 coeur
    h = js(os.path.join(R, 'coeur.json'))
    line('5 coeur', bool(h) and len(h) >= 4, 'coeur.json absent' if not h else '%d composants mesurés' % len(h))
    # 6 volume
    vt = glob.glob(os.path.join(R, 'volume', '*.txt'))
    bad = [os.path.basename(p) for p in vt if re.search(r'trop (haut|bas|profond|plat)|écart', open(p, encoding='utf-8').read())]
    line('6 volume', bool(vt) and not bad, 'aucune comparaison de profil' if not vt else ('écarts : ' + ', '.join(bad) if bad else 'profil conforme'))
    # 7 compare
    nc = [c for c in cws if not glob.glob(os.path.join(R, 'comparaison', c + '*.jpg'))]
    tab = glob.glob(os.path.join(R, 'apparence', '*paire*.txt')) + glob.glob(os.path.join(R, 'apparence', '*', '*.txt'))
    line('7 compare', bool(cws) and not nc and bool(tab), ('planche photo | rendu absente : ' + ', '.join(nc) if nc else 'planches par coloris') + ('' if tab else ' ; aucun tableau apparence paire'))
    # 8 stades
    st = glob.glob(os.path.join(R, 'comparaison', 'stades*.jpg'))
    fa = glob.glob(os.path.join(R, 'comparaison', 'fane*.jpg'))
    line('8 stades', bool(st) and bool(fa), ('' if st else 'planche des stades absente ; ') + ('' if fa else 'fané non comparé aux photos'))
    # 9 x3d
    b = os.path.join(R, 'banc3d.txt')
    if os.path.exists(b):
        t = open(b, encoding='utf-8').read()
        tot = [float(x) for x in re.findall(r'^total \S+ ([0-9.]+)', t, re.M)]
        seeds = max((len(l.split()) - 1 for l in t.splitlines() if re.match(r'^[0-9.]+:[0-9.]+', l)), default=0)
        line('9 x3d', bool(tot) and max(tot) == 0 and seeds >= 6, 'totaux %s sur %d graines' % (tot, seeds))
    else:
        line('9 x3d', False, 'banc3d.txt absent')
    # 10 temoins
    tm = os.path.join(R, 'temoins.txt')
    tt = open(tm, encoding='utf-8').read() if os.path.exists(tm) else ''
    line('10 temoins', bool(tt) and 'DIFF' not in tt, 'temoins.txt absent' if not tt else ('écarts : ' + tt.strip()[:120] if 'DIFF' in tt else 'identiques au pixel'))
    # 11 plante
    pl = glob.glob(os.path.join(R, 'comparaison', 'plante*.jpg'))
    line('11 plante', bool(pl), 'plante non comparée' if not pl else 'plante comparée')
    n = 0
    print('Liste de sortie de %s (%s)' % (sid, ', '.join(cws) or 'aucun coloris'))
    for k, ok, why in out:
        print('  %-11s %-7s %s' % (k, 'OK' if ok else 'MANQUE', why))
        n += 0 if ok else 1
    print('  => %s' % ('finie' if n == 0 else '%d point(s) manquant(s) : la sorte n\'est pas finie' % n))
    sys.exit(0 if n == 0 else 1)


if __name__ == '__main__':
    main()
