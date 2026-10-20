"""refqc.py: the reference photos of a sort, checked one by one and counted organ by organ (BONNES-PRATIQUES §18.1). No model, no browser.

  python fleur/refqc.py note <img>...                       the quality of each photo (one line each, verdict and reasons)
  python fleur/refqc.py inscrire <sid> <img> <organes> <vue> [--stade s] [--cultivar c] [--source url] [--note "..."]
  <organes> and <vue> take several values joined by + (a bud photo that also shows its peduncle: pedoncule+bouton gros-plan+profil).
                                                            adds a photo to the sort's register refcache/<sid>/refs-organes.json, with its quality;
                                                            <organes>: names of the fiche's organes joined by '+', or 'fleur' (the whole head)
  python fleur/refqc.py couverture <sid>                    the matrix organ x view or stage: how many good photos each cell has against what
                                                            it needs, and the list of what is missing (the brief of the next search)

A photo is good when its smaller side is at least MIN_SIDE px, the sharpest tenth of it is sharp (the variance of the Laplacian of its tiles,
so a soft background does not count against it), it is not burnt (a channel at 253 or more on more than 10 % of its subject: §16.1, here the
central half) and its blacks are not crushed. The needs per organ come from §1.2 and the lessons of the lily and the peony: every organ in
close-up, the flower in profile, three-quarter and face at least twice each, the fading stages, the back, the bud, the leaf on both sides.
Photo pixels stay in refcache/ (never committed): the register only holds paths, sources and numbers."""
import sys, os, json, argparse
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'refcache')
MIN_SIDE, SHARP, BURNT, CRUSH = 1200, 300.0, .10, .15

# what each kind of organ needs: {view or stage: minimum count of good photos}
NEED = {
    'fleur': {'face': 2, 'trois-quarts': 2, 'profil': 2, 'dos': 1, 'entrouvert': 2, 'declin': 2, 'fane': 2, 'fond-uni': 2},
    'petale': {'gros-plan': 2, 'contre-jour': 1, 'detache': 1},
    'coeur': {'gros-plan': 2},
    'calice': {'dos': 2},
    'bractee': {'dos': 1},
    'receptacle': {'gros-plan': 1},
    'bouton': {'profil': 2, 'gros-plan': 1},
    'tige': {'entiere': 2, 'gros-plan': 1},
    'pedoncule': {'gros-plan': 1},
    'feuille': {'dessus': 2, 'dessous': 1, 'attache': 1},
}
def kind(org):
    o = org.split('.')[0]
    return {'petale': 'petale', 'coeur': 'coeur'}.get(o, o)


def note(path):
    """the quality numbers of one photo, and its verdict"""
    im = cv2.imread(path)
    if im is None: return {'fichier': path, 'verdict': 'ko', 'raisons': ['illisible']}
    h, w = im.shape[:2]; s = 1200 / max(h, w); sm = cv2.resize(im, None, fx=s, fy=s, interpolation=cv2.INTER_AREA) if s < 1 else im
    g = cv2.cvtColor(sm, cv2.COLOR_BGR2GRAY).astype(np.float32)
    lap = cv2.Laplacian(g, cv2.CV_32F, ksize=3); H, W = g.shape; tv = []
    for y in range(0, H - H // 8 + 1, H // 8):
        for x in range(0, W - W // 8 + 1, W // 8): tv.append(float(lap[y:y + H // 8, x:x + W // 8].var()))
    sharp = float(np.percentile(tv, 90))
    c = sm[H // 4:3 * H // 4, W // 4:3 * W // 4]; burnt = float((c >= 253).any(2).mean()); crush = float((cv2.cvtColor(c, cv2.COLOR_BGR2GRAY) < 10).mean())
    why = []
    if min(h, w) < MIN_SIDE: why.append('petite : %d px de petit côté (< %d)' % (min(h, w), MIN_SIDE))
    if sharp < SHARP: why.append('floue : netteté %.0f (< %.0f)' % (sharp, SHARP))
    if burnt > BURNT: why.append('brûlée : %d %% du centre saturé (§16.1)' % (burnt * 100))
    if crush > CRUSH: why.append('noirs écrasés : %d %% du centre' % (crush * 100))
    return {'fichier': path.replace('\\', '/'), 'taille': [w, h], 'nettete': round(sharp, 1), 'brule': round(burnt, 3), 'ecrase': round(crush, 3),
            'verdict': 'ko' if why else 'ok', 'raisons': why}


def reg_path(sid): return os.path.join(ROOT, sid, 'refs-organes.json')
def load_reg(sid):
    p = reg_path(sid)
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {'_doc': 'registre des photos de référence par organe (fleur/refqc.py) : chemins, sources et chiffres seulement', 'photos': []}


def couverture(sid):
    reg = load_reg(sid); fiche = os.path.join(os.path.dirname(ROOT), 'catalogue', 'serre', 'fiches', sid + '.json')
    orgs = ['fleur'] + (list(json.load(open(fiche, encoding='utf-8')).get('organes', {}).keys()) if os.path.exists(fiche) else [])
    rows, miss = [], []
    for org in orgs:
        need = NEED.get(kind(org), {'gros-plan': 1})
        for vue, n in need.items():
            have = [p for p in reg['photos'] if org in p['organes'] and (vue in p['vue'].split('+') or p.get('stade') == vue)]
            good = [p for p in have if p['qualite']['verdict'] == 'ok']
            rows.append((org, vue, len(good), len(have), n))
            if len(good) < n: miss.append((org, vue, n - len(good)))
    print('| organe | vue ou stade | bonnes | inscrites | il faut |'); print('|---|---|---|---|---|')
    for org, vue, g, h, n in rows: print('| %s | %s | %s | %d | %d |' % (org, vue, ('**%d**' % g) if g < n else g, h, n))
    tot = sum(r[4] for r in rows); ok = sum(min(r[2], r[4]) for r in rows)
    print('\ncouverture %d / %d (%d %%)' % (ok, tot, 100 * ok / max(1, tot)))
    if miss:
        print('manque :'); [print('  - %s, %s : %d photo(s)' % m) for m in miss]
    return ok, tot, miss


def main():
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest='cmd', required=True)
    a = sp.add_parser('note'); a.add_argument('imgs', nargs='+')
    b = sp.add_parser('inscrire'); b.add_argument('sid'); b.add_argument('img'); b.add_argument('organes'); b.add_argument('vue')
    b.add_argument('--stade'); b.add_argument('--cultivar'); b.add_argument('--source'); b.add_argument('--note')
    c = sp.add_parser('couverture'); c.add_argument('sid')
    o = ap.parse_args()
    if o.cmd == 'note':
        for p in o.imgs:
            q = note(p); print('%s %s %s' % (q['verdict'].upper(), os.path.basename(p), ' ; '.join(q['raisons']) or 'netteté %.0f, brûlé %.2f' % (q['nettete'], q['brule'])))
    elif o.cmd == 'inscrire':
        reg = load_reg(o.sid); q = note(o.img); f = q['fichier']
        reg['photos'] = [p for p in reg['photos'] if p['fichier'] != f]
        reg['photos'].append({'fichier': f, 'organes': o.organes.split('+'), 'vue': o.vue, 'stade': o.stade, 'cultivar': o.cultivar, 'source': o.source,
                              'note': o.note, 'qualite': {k: q[k] for k in q if k != 'fichier'}})
        json.dump(reg, open(reg_path(o.sid), 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)
        print(q['verdict'].upper(), f, ' ; '.join(q['raisons']))
    else:
        couverture(o.sid)


if __name__ == '__main__':
    main()
