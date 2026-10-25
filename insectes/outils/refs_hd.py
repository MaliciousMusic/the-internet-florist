"""refs_hd.py: full-size reference photos of an insect, for measuring (insectes/PROTOCOLE.md, step 1). Pixels stay in refcache/.

  python insectes/outils/refs_hd.py hd <sid> <i>... [--w 2560]     candidate i of refcache/<sid>/cands.json (fleur/refs.py find) downloaded
                                                                   at up to w px wide into refcache/<sid>/hd/c<i>.jpg, then noted (refqc)
  python insectes/outils/refs_hd.py inscrire <sid> <i> <organes> <vues> [--note "..."]
                                                                   registers hd/c<i>.jpg for those organs and views (refs-organes.json)
  python insectes/outils/refs_hd.py couverture <sid>               organ x view matrix against the insect needs, and what is missing

The needs are those of an insect (PROTOCOLE.md §1), not of a flower: the whole insect from above, the side, the front, three-quarters
and below, in flight when it flies, and every organ in close-up (head and eyes, antennae, mouthparts, thorax, abdomen, legs, wings)."""
import sys, os, json, urllib.parse
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'fleur'))
import refs, refqc  # noqa: E402

ROOT = refs.ROOT
NEED = {
    'insecte': {'dessus': 2, 'profil': 2, 'face': 2, 'trois-quarts': 2, 'dessous': 1, 'vol': 2},
    'tete': {'gros-plan': 2, 'face': 1},
    'yeux': {'gros-plan': 1},
    'antennes': {'gros-plan': 1},
    'pieces-buccales': {'gros-plan': 1},
    'thorax': {'gros-plan': 2},
    'abdomen': {'dessus': 2, 'profil': 1},
    'pattes': {'gros-plan': 2},
    'ailes': {'a-plat': 1, 'gros-plan': 1},
}


def hd(sid, idx, w=2560):
    C = refs.jload(os.path.join(refs.d(sid), 'cands.json'), [])
    out = os.path.join(refs.d(sid), 'hd')
    os.makedirs(out, exist_ok=True)
    for i in idx:
        c = C[i]
        p = os.path.join(out, 'c%03d.jpg' % i)
        if not os.path.exists(p):
            r = refs.api(action='query', titles=c['title'], prop='imageinfo', iiprop='url|size', iiurlwidth=w)
            ii = next(iter(r['query']['pages'].values()))['imageinfo'][0]
            url = ii.get('thumburl') if ii.get('width', 0) > w else ii['url']
            open(p, 'wb').write(refs.get(url))
        n = refqc.note(p)
        print(i, n['verdict'], n.get('taille'), 'net %s' % n.get('nettete'), '; '.join(n['raisons']), c['title'][5:70])


def inscrire(sid, i, organes, vues, note=''):
    reg = refqc.load_reg(sid)
    C = refs.jload(os.path.join(refs.d(sid), 'cands.json'), [])
    p = os.path.join(refs.d(sid), 'hd', 'c%03d.jpg' % i)
    q = refqc.note(p)
    reg['photos'] = [x for x in reg['photos'] if x.get('i') != i]
    reg['photos'].append({'i': i, 'fichier': os.path.relpath(p, os.path.dirname(ROOT)).replace('\\', '/'), 'organes': organes.split('+'), 'vues': vues.split('+'),
                          'source': C[i]['page'], 'auteur': C[i].get('author', ''), 'licence': C[i].get('lic', ''), 'qualite': q, 'note': note})
    json.dump(reg, open(refqc.reg_path(sid), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('inscrite', i, q['verdict'])


def couverture(sid):
    reg = refqc.load_reg(sid)
    miss = []
    for org, need in NEED.items():
        row = []
        for v, n in need.items():
            k = sum(1 for x in reg['photos'] if x['qualite']['verdict'] == 'ok' and (org in x['organes'] or (org == 'insecte' and 'insecte' in x['organes'])) and v in x['vues'])
            row.append('%s %d/%d' % (v, k, n))
            if k < n: miss.append('%s %s (%d manquante%s)' % (org, v, n - k, 's' if n - k > 1 else ''))
        print('%-16s %s' % (org, '  '.join(row)))
    print('manque :', '; '.join(miss) if miss else 'rien')
    return miss


if __name__ == '__main__':
    a = sys.argv[1:]
    opt = {}
    if '--w' in a: j = a.index('--w'); opt['w'] = int(a[j + 1]); del a[j:j + 2]
    if '--note' in a: j = a.index('--note'); opt['note'] = a[j + 1]; del a[j:j + 2]
    if a[0] == 'hd': hd(a[1], [int(x) for x in a[2:]], opt.get('w', 2560))
    elif a[0] == 'inscrire': inscrire(a[1], int(a[2]), a[3], a[4], opt.get('note', ''))
    elif a[0] == 'couverture': couverture(a[1])
