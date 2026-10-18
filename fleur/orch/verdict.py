"""verdict.py: the witnesses of a publication judged, not only printed (written by temoins.sh and publier.sh prep, read by publier.sh fin).

  python fleur/orch/verdict.py ecrire <tag> [--res fleur/res] [--own] [--out <json>]
      judges, in <res>: sku-avant-<tag>.txt / sku-apres-<tag>.txt (no SKU moved), anem-<tag>.txt (the img.py diff line of the anemone
      witness: 0.00 %), rtest-apres-<tag>.json (every line IDENTIQUE), rtest-tul-avant-<tag>.json / rtest-tul-apres-<tag>.json (the tulip and
      ranunculus witnesses no worse after than before, line by line) and, with --own, rtest-own-avant-<tag>.json / rtest-own-apres-<tag>.json
      (the sorts' compositions the same before and after). A missing or unreadable file is red. Writes <res>/temoins-verdict.json
      {"tag", "t", "vert", "lignes": [{"temoin", "vert", "detail"}]}, prints one line per witness; exit 0 when all green, 1 otherwise.
  python fleur/orch/verdict.py controler [<temoins-verdict.json>] [--tag <tag>] [--depuis <epoch>] [--own]
      exit 0 only when the verdict is green, of that tag, written after --depuis (the start of the publication) and, with --own, holds the
      sorts' own before/after line; else prints why (in French, for publier.sh fin) and exits 1."""
import sys, os, re, json, time

RT = re.compile(r'\s*(\S+) (\S+) (IDENTIQUE|DIFFERENT|ERR)')
COMPO = re.compile(r'(\S+ \S+) (?:IDENTIQUE|DIFFERENT) (-?\d+:-?\d+)')


def opts(a):
    o, p, j = {}, [], 0
    while j < len(a):
        if a[j].startswith('--'):
            if j + 1 < len(a) and not a[j + 1].startswith('--'):
                o[a[j][2:]] = a[j + 1]
                j += 2
            else:
                o[a[j][2:]] = True
                j += 1
        else:
            p.append(a[j])
            j += 1
    return o, p


def read(p):
    try:
        return open(p, encoding='utf-8', errors='replace').read()
    except OSError:
        return None


def rtest(txt):
    """{'stage vessel': IDENTIQUE|DIFFERENT|ERR} of an rtest page line (items separated by ' | ', as pipe.py's rtest_parse)"""
    out = {}
    for it in (txt or '').split(' | '):
        m = RT.match(it)
        if m:
            out['%s %s' % (m[1], m[2])] = m[3]
    return out


def line(name, ok, detail):
    return {'temoin': name, 'vert': bool(ok), 'detail': detail}


def sku(res, tag):
    a, b = read('%s/sku-avant-%s.txt' % (res, tag)), read('%s/sku-apres-%s.txt' % (res, tag))
    if a is None or b is None:
        return line('SKU déplacés', False, 'fichier manquant : %s' % ('sku-avant' if a is None else 'sku-apres'))
    A = [x.rstrip('\n').split('\t') for x in a.splitlines() if x.strip()]
    B = [x.rstrip('\n').split('\t') for x in b.splitlines() if x.strip()]
    moved = ['%s %s -> %s' % (x[0], x[1] if len(x) > 1 else '?', (y[1] if len(y) > 1 else '?') if y else '-') for x, y in zip(A, B + [None] * len(A))
             if not y or (x[1:2] != y[1:2])]
    if not A:
        return line('SKU déplacés', False, 'liste avant vide')
    return line('SKU déplacés', not moved, 'avant %d, après %d, déplacés %d%s' % (len(A), len(B), len(moved), (' : ' + ' ; '.join(moved[:4])) if moved else ''))


def anem(res, tag):
    t = read('%s/anem-%s.txt' % (res, tag))
    m = re.search(r'changed ([\d.]+)%', t or '')
    if not m:
        return line('anémone contre base_v2', False, 'pas de mesure (anem-%s.txt %s)' % (tag, 'manquant' if t is None else 'sans « changed x% »'))
    return line('anémone contre base_v2', float(m[1]) == 0, '%s %%' % m[1])


def own_after(res, tag):
    t = read('%s/rtest-apres-%s.json' % (res, tag))
    r = rtest(t)
    if not r:
        return line('rtest des sortes après', False, 'rtest-apres-%s.json %s' % (tag, 'manquant' if t is None else 'sans ligne rtest'))
    bad = [k + ' ' + v for k, v in r.items() if v != 'IDENTIQUE']
    return line('rtest des sortes après', not bad, '%d lignes, %d IDENTIQUE%s' % (len(r), len(r) - len(bad), (' ; pas identiques : ' + ', '.join(bad[:5])) if bad else ''))


def tulips(res, tag):
    a, b = read('%s/rtest-tul-avant-%s.json' % (res, tag)), read('%s/rtest-tul-apres-%s.json' % (res, tag))
    A, B = rtest(a), rtest(b)
    if not A or not B:
        return line('témoins tulipes et renoncules', False, 'rtest-tul-%s-%s.json %s' % ('avant' if not A else 'apres', tag, 'manquant ou sans ligne'))
    worse = ['%s %s -> %s' % (k, v, B.get(k, 'absent')) for k, v in A.items() if v == 'IDENTIQUE' and B.get(k) != 'IDENTIQUE']
    worse += ['%s ERR' % k for k, v in B.items() if v == 'ERR' and A.get(k) != 'ERR']
    same = sum(1 for k in A if B.get(k) == A[k])
    return line('témoins tulipes et renoncules', not worse, '%d lignes, %d comme avant%s' % (len(A), same, (' ; pires : ' + ', '.join(worse[:5])) if worse else ''))


def own_compo(res, tag):
    a, b = read('%s/rtest-own-avant-%s.json' % (res, tag)), read('%s/rtest-own-apres-%s.json' % (res, tag))
    A, B = COMPO.findall(a or ''), COMPO.findall(b or '')
    if not A or not B:
        return line('compositions des sortes avant == après', False, 'rtest-own-%s-%s.json %s' % ('avant' if not A else 'apres', tag, 'manquant ou sans ligne'))
    diff = [x[0] for x, y in zip(A, B) if x != y]
    ok = A == B
    return line('compositions des sortes avant == après', ok, '%d et %d lignes%s' % (len(A), len(B), (' ; différentes : ' + ', '.join(diff[:5])) if not ok and diff else ''))


def ecrire(a):
    o, p = opts(a)
    tag, res = p[0], o.get('res', 'fleur/res')
    L = [sku(res, tag), anem(res, tag), own_after(res, tag), tulips(res, tag)]
    if o.get('own'):
        L.append(own_compo(res, tag))
    v = {'tag': tag, 't': int(time.time()), 'vert': all(x['vert'] for x in L), 'lignes': L}
    out = o.get('out') or '%s/temoins-verdict.json' % res
    with open(out, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(v, f, ensure_ascii=False, indent=1)
        f.write('\n')
    for x in L:
        print('%-5s %s : %s' % ('VERT' if x['vert'] else 'ROUGE', x['temoin'], x['detail']))
    print('verdict des témoins %s : %s (%s)' % (tag, 'VERT' if v['vert'] else 'ROUGE', out))
    return 0 if v['vert'] else 1


def controler(a):
    o, p = opts(a)
    path = p[0] if p else 'fleur/res/temoins-verdict.json'
    try:
        v = json.load(open(path, encoding='utf-8'))
    except Exception as e:
        print('refusé : pas de verdict des témoins lisible (%s : %s) ; relancer prep' % (path, e))
        return 1
    why = []
    if o.get('tag') and o['tag'] is not True and v.get('tag') != o['tag']:
        why.append('le verdict est celui de %s, pas de %s' % (v.get('tag'), o['tag']))
    if o.get('depuis') and o['depuis'] is not True and int(v.get('t') or 0) < int(float(o['depuis'])):
        why.append('le verdict date d\'avant cette publication')
    if o.get('own') and not any(x.get('temoin', '').startswith('compositions des sortes') for x in v.get('lignes') or []):
        why.append('la ligne des compositions des sortes avant/après manque')
    red = [x for x in v.get('lignes') or [] if not x.get('vert')]
    why += ['%s rouge (%s)' % (x.get('temoin'), x.get('detail')) for x in red]
    if not v.get('lignes'):
        why.append('aucun témoin dans le verdict')
    if why or not v.get('vert'):
        print('refusé : ' + ' ; '.join(why or ['verdict rouge']))
        return 1
    print('témoins verts (%s, %d lignes)' % (v.get('tag'), len(v['lignes'])))
    return 0


if __name__ == '__main__':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    cmds = {'ecrire': ecrire, 'controler': controler}
    if len(sys.argv) < 2 or sys.argv[1] not in cmds:
        print(__doc__)
        sys.exit(2)
    sys.exit(cmds[sys.argv[1]](sys.argv[2:]))
