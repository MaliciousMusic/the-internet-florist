#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""fiche.py : controle d'une fiche morphologique `fiche-morpho/1` (catalogue/serre/methode/fiche/SCHEMA.md).

    python fleur/fiche.py check <sid | chemin.json> [--no-code] [--quiet] [--lien tete|plante|tout]

Ne rend rien, ne lance aucun navigateur, aucun serveur. Les expressions `code` sont lues par node (fleur/fiche_eval.js : l'application
construite comme le fait mkapp.sh, chargee dans un contexte vm avec des bouchons pour document/window), sans dessiner.

Controles (SCHEMA §8) :
  1. schema : champs de tete, registre des photos (cles `<sid>:<sha1 de l'URL>[:8]`), organes (role, rubriques), objets V bien formes
     (methode, confiance, unites, plage, photos presentes dans le registre), table des stades, renvois `suit`, renvois aux questions (Qn) ;
  2. valeurs sans provenance, par organe et par rubrique (methode `code` ou `hypothese`, et `oeil`/`segmente` sans photo ni reference) ;
  3. code : chaque expression `code` est evaluee ; on signale
        - `retenu` different de la valeur lue dans le code,
        - `v` hors de sa `plage` sans `ecart` ecrit,
        - `retenu` hors de la `plage` sans `ecart` ecrit,
        - `v` different de `retenu` (meme forme numerique) sans `ecart` ecrit,
        - expression qui ne s'evalue pas ;
     et on liste les ecarts DECLARES (ceux qui ont un `ecart` ecrit : ce sont les divergences connues) ;
  4. tableau de couverture organe x rubrique : S (sourcee : photo ou reference attachee a la valeur), U (chiffree, source globale ou absente),
     C (code seul), M (manquante ou inconnue). Une case prend la lettre la plus faible de ses valeurs connues (S < U < C) ; M seulement si toutes sont inconnues ou si la rubrique manque ; une etoile (S*) signale une valeur inconnue dans la case.

Ce que le controle de code sait faire, et ne sait pas faire :
  - sait : lire toute constante ou expression des fichiers de app/ listes dans mkapp.sh (SVB_DEF, SVA_GENES, SVA_CW, LIFE_SP, RECIPES, SZG, lifeAt,
    lifeWEl, lifeOp...), avec `P` = le P de svBloom (Object.assign({}, kit.defauts, kit.spec)) et `probe.bract(op, wl)` (options de la bractee) ;
  - une constante ecrite en dur dans le corps d'une fonction de dessin (ex. le .125 du dome dans svaHeart) ne s'evalue pas : elle porte
    `code: "const"` et `ligne: "app/<fichier>.js:<n>"` ; la ligne est relue et chaque nombre de `retenu` doit y figurer (sinon le code a bouge) ;
    une valeur `methode: code` sans aucun `code` est comptee dans « code sans chemin evaluable » ;
  - ne lance pas de rendu : il ne mesure donc ni un rayon de couronne ni un nombre d'elements dessines.
  5. (--lien tete|plante|tout) chaque valeur chiffree des organes dessines du groupe porte `code` ou un `ecart` type (fin de forme, fin de plante).
Regles du schema verifiees en plus (SCHEMA §2) : un angle (deg, rad) porte `repere` (axe, plan, horizontale, tige, piece) ; une couleur a l'unite
`hex` (#rrggbb, plage = les mesures par photo) ; `ecart` est type {type: confirme | divergence | budget, texte} ; methodes segmente,
mesure-echelle et regle exigent leurs photos. La derniere ligne imprimee est un objet JSON (comptes de la fiche) lu par pipe.py.

Code de sortie : 0 fiche valide ; 1 erreurs de schema ou ecarts de code non declares ; 2 probleme d'environnement (fiche absente, node absent).
"""
import argparse, hashlib, json, os, re, subprocess, sys
from collections import Counter, OrderedDict, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FICHES = os.path.join(ROOT, 'catalogue', 'serre', 'fiches')

ROLES = ['perianthe', 'coeur', 'bouton', 'bractee', 'calice', 'receptacle', 'pedicelle', 'tige', 'feuille']
RUBRIQUES = ['nombre', 'disposition', 'contour', 'taille', 'courbure', 'matiere', 'nervation', 'zones', 'jointures', 'section', 'stades']
ORGAN_META = {'role', 'code', 'dessinee', 'note_rendu', 'note'}   # cles d'organe hors rubriques
METHODES = ['mesure-echelle', 'segmente', 'regle', 'oeil', 'reference', 'code', 'hypothese']
MESURES = ('mesure-echelle', 'segmente', 'regle')   # methodes chiffrees sur photo : elles exigent leurs photos
CONFS = ['A', 'B', 'C', 'D']
UNITES = {'L', 'R0', 'D', 'deg', 'rad', 'mm', 'cm', 'n', 'ratio', 'jours', 'hex'}
ANGLES = {'deg', 'rad'}
REPERES = {'axe', 'plan', 'horizontale', 'tige', 'piece'}   # SCHEMA §2 : a quoi se mesure un angle (W3)
ECARTS = {'confirme', 'divergence', 'budget'}              # SCHEMA §2 : ecart type (W13)
HEX = re.compile(r'^#[0-9a-fA-F]{6}$')
LIGNE = re.compile(r'^((?:app|pilote|demo|lab)/[\w./-]+\.js):(\d+)$')   # code "const" : la ligne ou la constante est ecrite en dur (W4)
V_KEYS = {'v', 'plage', 'unite', 'n', 'methode', 'photos', 'conf', 'ref', 'code', 'retenu', 'ecart', 'note', 'repere', 'ligne'}
GROUPES = {'tete': {'perianthe', 'coeur', 'receptacle', 'bouton', 'bractee', 'calice'}, 'plante': {'tige', 'pedicelle', 'feuille'}}
GROUPES['tout'] = GROUPES['tete'] | GROUPES['plante']
STADES_OBLIGATOIRES = ['bouton', 'gonfle', 'entrouvert', 'ouvert', 'plein', 'declin', 'fane']
STATUTS = {'mesure', 'hypothese'}
ROLE_RUBRIQUES = {   # rubriques qui s'appliquent a chaque role (proposition de ce controle : le SCHEMA §4 dit « celles qui s'appliquent » sans les lister)
    'perianthe': ['nombre', 'disposition', 'contour', 'taille', 'courbure', 'matiere', 'nervation', 'zones', 'jointures', 'stades'],
    'coeur': ['nombre', 'disposition', 'contour', 'taille', 'matiere', 'zones', 'jointures', 'stades'],
    'receptacle': ['taille', 'matiere', 'zones', 'jointures', 'stades'],
    'bouton': ['disposition', 'contour', 'taille', 'matiere', 'zones', 'jointures', 'stades'],
    'bractee': ['nombre', 'disposition', 'contour', 'taille', 'courbure', 'matiere', 'nervation', 'zones', 'jointures', 'stades'],
    'calice': ['nombre', 'disposition', 'contour', 'taille', 'matiere', 'zones', 'jointures', 'stades'],
    'tige': ['taille', 'courbure', 'matiere', 'zones', 'jointures', 'section', 'stades'],
    'pedicelle': ['taille', 'courbure', 'matiere', 'zones', 'jointures', 'section', 'stades'],
    'feuille': ['nombre', 'disposition', 'contour', 'taille', 'courbure', 'matiere', 'nervation', 'zones', 'jointures', 'section', 'stades'],
}
RANK = {'S': 0, 'U': 1, 'C': 2, 'M': 3}


def out(*a):
    print(*a)


def sha8(s):
    return hashlib.sha1(s.encode('utf-8')).hexdigest()[:8]


def is_num(x):
    return isinstance(x, (int, float)) and not isinstance(x, bool)


# ------------------------------------------------------------------------------------------------------------------ parcours
def walk_vs(node, path):
    """produit (chemin, noeud V) pour chaque objet portant `methode` ; descend dans les cles hors V_KEYS d'un V (V enfants : loi, qualitatif...)."""
    if isinstance(node, dict):
        if 'methode' in node:
            yield path, node
            for k, val in node.items():
                if k in V_KEYS: continue
                if isinstance(val, (dict, list)):
                    yield from walk_vs(val, path + [k])
            return
        for k, val in node.items():
            yield from walk_vs(val, path + [k])
    elif isinstance(node, list):
        for i, val in enumerate(node):
            yield from walk_vs(val, path + ['[%d]' % i])


def resolve_suit(ref, organes):
    for okey in sorted(organes, key=len, reverse=True):
        if ref == okey:
            return organes[okey]
        if ref.startswith(okey + '.'):
            node = organes[okey]
            for k in ref[len(okey) + 1:].split('.'):
                if isinstance(node, dict) and k in node: node = node[k]
                else: return None
            return node
    return None


def expand_suit(node, organes, depth=0):
    """remplace les renvois {suit: chemin} par leur cible (liste ou dict)."""
    if depth > 6: return node
    if isinstance(node, dict) and 'suit' in node and 'methode' not in node:
        t = resolve_suit(node['suit'], organes)
        return expand_suit(t, organes, depth + 1) if t is not None else None
    if isinstance(node, list):
        res = []
        for x in node:
            e = expand_suit(x, organes, depth + 1)
            if isinstance(e, list): res.extend(e)
            elif e is not None: res.append(e)
        return res
    if isinstance(node, dict):
        return {k: expand_suit(v, organes, depth + 1) for k, v in node.items()}
    return node


def cited_photos(node, acc):
    if isinstance(node, dict):
        for k, v in node.items():
            if k in ('photos', 'photos_contradictoires') and isinstance(v, list):
                acc.extend([x for x in v if isinstance(x, str)])
            else:
                cited_photos(v, acc)
    elif isinstance(node, list):
        for v in node: cited_photos(v, acc)


def all_strings(node, acc):
    if isinstance(node, str): acc.append(node)
    elif isinstance(node, dict):
        for v in node.values(): all_strings(v, acc)
    elif isinstance(node, list):
        for v in node: all_strings(v, acc)


# ------------------------------------------------------------------------------------------------------------------ 1. schema
def check_schema(f, sid, errs, warns):
    if f.get('schema') != 'fiche-morpho/1': errs.append("schema : attendu « fiche-morpho/1 », trouve %r" % f.get('schema'))
    if f.get('sid') != sid: errs.append("sid %r different du nom de fichier %r" % (f.get('sid'), sid))
    for k, t in (('nom', str), ('taxon', dict), ('kit', dict), ('photos', dict), ('organes', dict), ('varietes', dict), ('stades', dict), ('rendu', dict), ('questions', list)):
        if not isinstance(f.get(k), t): errs.append("champ de tete `%s` absent ou de mauvais type (attendu %s)" % (k, t.__name__))
    kit = f.get('kit') or {}
    for k in ('moteur', 'module'):
        if not kit.get(k): errs.append("kit.%s absent" % k)
    if kit.get('module') and not os.path.exists(os.path.join(ROOT, kit['module'].split(' ')[0])):
        warns.append("kit.module %r n'existe pas dans le depot" % kit['module'])
    photos = f.get('photos') or {}
    for key, p in photos.items():
        if not re.match(r'^[a-z0-9-]+:[0-9a-f]{8}$', key): errs.append("photo %s : cle mal formee (attendu <sid>:<8 hex>)" % key); continue
        for k in ('titre', 'auteur', 'licence', 'url', 'local', 'tags', 'vu', 'echelle'):
            if k not in p: errs.append("photo %s : champ `%s` absent" % (key, k))
        if not isinstance(p.get('tags'), list): errs.append("photo %s : tags doit etre une liste" % key)
        src = p.get('url_image') or p.get('url')
        if src:
            if sha8(src) != key.split(':')[1]: errs.append("photo %s : la cle ne vient pas du sha1 de l'URL (%s)" % (key, sha8(src)))
        else:
            h = key.split(':')[1]
            if h not in (sha8('File:' + str(p.get('titre'))), sha8('stock:' + str(p.get('titre')))):
                errs.append("photo %s : sans URL, la cle doit etre le sha1 de 'File:'+titre ou 'stock:'+titre" % key)
            elif p.get('cle_depuis') != 'titre': warns.append("photo %s : sans URL mais `cle_depuis` n'est pas « titre »" % key)
        if p.get('local') and p['local'].startswith(('http', '/')) : errs.append("photo %s : `local` doit etre un chemin relatif du depot" % key)
    # organes
    orgs = f.get('organes') or {}
    for oname, o in orgs.items():
        if not isinstance(o, dict): errs.append("organe %s : objet attendu" % oname); continue
        if o.get('role') not in ROLES: errs.append("organe %s : role %r hors de %s" % (oname, o.get('role'), ROLES))
        for k in o:
            if k not in RUBRIQUES and k not in ORGAN_META: warns.append("organe %s : cle `%s` hors SCHEMA §4" % (oname, k))
    # V
    nv = 0
    for blk, name in ((orgs, 'organes'), (f.get('varietes'), 'varietes'), (f.get('stades'), 'stades')):
        for path, v in walk_vs(blk, [name]):
            nv += 1
            check_v('/'.join(path), v, photos, errs, warns)
    # dicts avec `v` sans methode
    def lone(node, path):
        if isinstance(node, dict):
            if 'v' in node and 'methode' not in node: errs.append("%s : objet V sans `methode`" % '/'.join(path))
            for k, x in node.items(): lone(x, path + [k])
        elif isinstance(node, list):
            for i, x in enumerate(node): lone(x, path + ['[%d]' % i])
    lone(f.get('organes'), ['organes']); lone(f.get('varietes'), ['varietes']); lone(f.get('stades'), ['stades'])
    # renvois suit
    def suits(node, path):
        if isinstance(node, dict):
            if 'suit' in node and 'methode' not in node:
                if resolve_suit(node['suit'], orgs) is None: errs.append("%s : renvoi `suit` %r introuvable" % ('/'.join(path), node['suit']))
            for k, x in node.items(): suits(x, path + [k])
        elif isinstance(node, list):
            for i, x in enumerate(node): suits(x, path + ['[%d]' % i])
    suits(orgs, ['organes'])
    # photos citees
    cited = []
    cited_photos(f.get('organes'), cited); cited_photos(f.get('varietes'), cited); cited_photos(f.get('stades'), cited)
    for k in set(cited):
        if k not in photos: errs.append("photo citee %s absente du registre `photos`" % k)
    unused = sorted(set(photos) - set(cited))
    if unused: warns.append("photos du registre jamais citees : %s" % ', '.join(unused))
    # varietes
    for cid, vv in (f.get('varietes') or {}).items():
        if not isinstance(vv, dict): errs.append("variete %s : objet attendu" % cid); continue
        if 'forme' not in vv and 'organes' not in vv: errs.append("variete %s : ni `forme` ni `organes`" % cid)
        for oname in (vv.get('organes') or {}):
            if oname not in orgs: errs.append("variete %s : organe %r inconnu" % (cid, oname))
    # stades
    st = f.get('stades') or {}
    rows = st.get('table')
    if not isinstance(rows, list): errs.append("stades.table absente")
    else:
        names = [r.get('stade') for r in rows]
        for need in STADES_OBLIGATOIRES:
            if need not in names: errs.append("stades.table : stade obligatoire %r absent" % need)
        for r in rows:
            for k in ('stade', 'op', 'wl', 'photos', 'statut'):
                if k not in r: errs.append("stades.table[%s] : `%s` absent" % (r.get('stade'), k))
            s = r.get('statut', '')
            if not (s in STATUTS or str(s).startswith('herite:')): errs.append("stades.table[%s] : statut %r (mesure, herite:<sid>, hypothese)" % (r.get('stade'), s))
    # questions
    ids = [q.get('id') for q in (f.get('questions') or [])]
    if len(set(ids)) != len(ids): errs.append("questions : identifiants en double")
    for q in f.get('questions') or []:
        for k in ('id', 'question', 'proposition'):
            if not q.get(k): errs.append("question %s : `%s` absent" % (q.get('id'), k))
    strs = []
    all_strings({k: f.get(k) for k in ('organes', 'varietes', 'stades')}, strs)
    for s in strs:
        for m in re.finditer(r'\bQ(\d+b?)\b', s):
            if 'Q' + m.group(1) not in ids: errs.append("renvoi a une question inexistante : Q%s (dans : %s...)" % (m.group(1), s[:60]))
    return nv, cited


def check_v(path, v, photos, errs, warns):
    m = v.get('methode')
    if m not in METHODES: errs.append("%s : methode %r (attendu %s)" % (path, m, METHODES))
    if 'v' not in v: errs.append("%s : `v` absent" % path)
    if v.get('v') is None and m != 'hypothese': errs.append("%s : v nul exige methode « hypothese »" % path)
    if v.get('conf') not in CONFS: errs.append("%s : conf %r (A, B, C ou D)" % (path, v.get('conf')))
    u = v.get('unite')
    if u is not None and u not in UNITES: errs.append("%s : unite %r inconnue (SCHEMA §2 : %s)" % (path, u, ', '.join(sorted(UNITES))))
    if u in ANGLES:   # W3 : un angle dit a quoi il se mesure
        if v.get('repere') not in REPERES: errs.append("%s : angle sans `repere` valide (%r ; attendu %s)" % (path, v.get('repere'), ', '.join(sorted(REPERES))))
    elif 'repere' in v: warns.append("%s : `repere` sur une valeur qui n'est pas un angle" % path)
    if u == 'hex':   # W6 : une couleur, ou une liste de couleurs ; la plage = les mesures par photo
        hv = v.get('v')
        if hv is not None and not all(isinstance(x, str) and HEX.match(x) for x in (hv if isinstance(hv, list) else [hv])):
            errs.append("%s : unite hex mais v n'est pas #rrggbb (%r)" % (path, hv))
        if v.get('plage') is not None and not all(isinstance(x, str) and HEX.match(x) for x in v['plage']):
            errs.append("%s : unite hex mais la plage n'est pas une liste de #rrggbb" % path)
    pl = v.get('plage')
    if pl is not None and not (isinstance(pl, list) and len(pl) >= 2): errs.append("%s : plage doit etre une liste de 2 valeurs ou plus" % path)
    if 'n' in v and not (isinstance(v['n'], int) and v['n'] >= 0): errs.append("%s : n doit etre un entier" % path)
    ph = v.get('photos')
    if ph is not None:
        if not isinstance(ph, list): errs.append("%s : photos doit etre une liste" % path)
        else:
            for k in ph:
                if k not in photos: errs.append("%s : photo %s absente du registre" % (path, k))
    if 'code' in v and not isinstance(v['code'], str): errs.append("%s : code doit etre une chaine" % path)
    if isinstance(v.get('code'), str) and 'retenu' not in v: errs.append("%s : `code` sans `retenu`" % path)
    if v.get('code') == 'const':   # W4 : constante en dur dans une fonction : son fichier et sa ligne, relus au point 3
        if not LIGNE.match(str(v.get('ligne') or '')): errs.append("%s : code « const » sans `ligne` « app/<fichier>.js:<n> » (%r)" % (path, v.get('ligne')))
    elif 'ligne' in v: warns.append("%s : `ligne` sans code « const »" % path)
    e = v.get('ecart')
    if e is not None:   # W13 : {type: confirme | divergence | budget, texte}
        if not isinstance(e, dict): errs.append("%s : ecart non type (attendu {\"type\": %s, \"texte\": ...})" % (path, ' | '.join(sorted(ECARTS))))
        else:
            if e.get('type') not in ECARTS: errs.append("%s : ecart.type %r (attendu %s)" % (path, e.get('type'), ', '.join(sorted(ECARTS))))
            if not (isinstance(e.get('texte'), str) and e['texte'].strip()): errs.append("%s : ecart sans `texte`" % path)
    if m == 'code' and v.get('conf') not in ('C', 'D'): warns.append("%s : methode code avec confiance %s" % (path, v.get('conf')))
    if m == 'hypothese' and v.get('conf') != 'D': warns.append("%s : hypothese avec confiance %s (attendu D)" % (path, v.get('conf')))
    if m in MESURES and not v.get('photos'): errs.append("%s : %s sans photo" % (path, m))
    if m == 'reference' and not (v.get('ref') or v.get('photos')): errs.append("%s : reference sans `ref`" % path)


def ecart_txt(e):
    return '[%s] %s' % (e.get('type'), e.get('texte')) if isinstance(e, dict) else str(e)




# ------------------------------------------------------------------------------------------------------------------ 2. provenance
def classify(v):
    m = v.get('methode')
    if m == 'code': return 'C'
    if m == 'hypothese': return 'M' if v.get('v') is None else 'U'
    has = bool(v.get('photos'))
    if m == 'reference': return 'S' if (v.get('ref') or has) else 'U'
    return 'S' if has else 'U'


def provenance(f):
    res = defaultdict(list)       # (organe, rubrique) -> [(nom, methode, etat)]
    weak_eye = []
    for path, v in walk_vs(f['organes'], []):
        organe, rub = path[0], (path[1] if len(path) > 1 else '-')
        label = '/'.join(path[2:]) if len(path) > 2 else '(rubrique)'
        c = classify(v)
        if v['methode'] == 'code': res[(organe, rub)].append((label, 'code', 'code sans source' + ('' if v.get('code') else ' ET sans chemin evaluable')))
        elif v['methode'] == 'hypothese': res[(organe, rub)].append((label, 'hypothese', 'inconnue' if v.get('v') is None else 'hypothese chiffree'))
        elif c == 'U': weak_eye.append((organe, rub, label, v['methode']))
    return res, weak_eye


# ------------------------------------------------------------------------------------------------------------------ 3. code
def run_node(exprs, kit):
    wrap = '((P)=>(%s))(Object.assign({},' + (kit.get('defauts') or '{}') + ',' + (kit.get('spec') or '{}') + '))'
    p = subprocess.run(['node', os.path.join(ROOT, 'fleur', 'fiche_eval.js')], input=json.dumps({'wrap': wrap, 'exprs': exprs}).encode('utf-8'),
                       capture_output=True, timeout=300, cwd=ROOT)
    if p.returncode: raise RuntimeError(p.stderr.decode('utf-8', 'replace')[:500])
    return json.loads(p.stdout.decode('utf-8'))


def same(a, b, rel=1e-6):
    """egalite de deux valeurs JSON ; les nombres a `rel` pres (1e-6 pour retenu/code ; 2 % pour v/code, que la fiche arrondit)."""
    if is_num(a) and is_num(b): return abs(a - b) <= 1e-9 + rel * abs(b)
    if isinstance(a, list) and isinstance(b, list): return len(a) == len(b) and all(same(x, y, rel) for x, y in zip(a, b))
    if isinstance(a, dict) and isinstance(b, dict): return a.keys() == b.keys() and all(same(a[k], b[k], rel) for k in a)
    return a == b


def nums(x):
    """les nombres d'une valeur simple (nombre, liste de nombres ; les chaines d'une liste sont ignorees) ; None pour une loi ou un profil (listes de listes)."""
    if is_num(x): return [x]
    if isinstance(x, list):
        if any(isinstance(y, (list, dict)) for y in x): return None
        n = [y for y in x if is_num(y)]
        return n or None
    return None


NUM = re.compile(r'(?<![\w.])(?:\d+\.\d*|\.\d+|\d+)(?:[eE][-+]?\d+)?')


def read_const(v):
    """code "const" (W4): the numbers of `retenu` must be written on the line `ligne` (app/<file>.js:<n>) of the copy; {ok, v} like fiche_eval.js"""
    m = LIGNE.match(str(v.get('ligne') or ''))
    if not m: return {'ok': False, 'err': 'ligne mal formee %r' % v.get('ligne')}
    fp, n = os.path.join(ROOT, m.group(1)), int(m.group(2))
    if not os.path.exists(fp): return {'ok': False, 'err': 'fichier %s absent' % m.group(1)}
    lines = open(fp, encoding='utf-8', errors='replace').read().split('\n')
    if not 1 <= n <= len(lines): return {'ok': False, 'err': 'ligne %d hors du fichier (%d lignes)' % (n, len(lines))}
    found = [abs(float(x)) for x in NUM.findall(lines[n - 1])]
    want = nums(v.get('retenu'))
    if not want: return {'ok': False, 'err': 'code « const » : retenu sans nombre'}
    miss = [x for x in want if not any(abs(abs(x) - y) <= 1e-9 * (1 + y) for y in found)]
    if miss: return {'ok': False, 'err': 'constante %s absente de %s (le code a bougé : corriger `ligne`)' % (', '.join('%g' % x for x in miss), v['ligne'])}
    return {'ok': True, 'v': v.get('retenu')}


def check_code(f, errs, warns):
    vs = [(p, v) for blk, name in ((f['organes'], 'organes'), (f['varietes'], 'varietes'), (f['stades'], 'stades')) for p, v in walk_vs(blk, [name])]
    coded = [(p, v) for p, v in vs if isinstance(v.get('code'), str) and v['code'] != 'const']
    consts = [(p, v) for p, v in vs if v.get('code') == 'const']
    nopath = [(p, v) for p, v in vs if v['methode'] == 'code' and not isinstance(v.get('code'), str)]
    exprs = sorted({v['code'] for p, v in coded})
    try:
        r = run_node(exprs, f['kit'])
    except Exception as e:
        errs.append("controle du code impossible : %s" % e); return None
    load = r['load']
    for fl in load.get('failed', []): warns.append("chargement de l'application : %s -> %s" % (fl.get('file'), fl.get('err')))
    mism, plage_v, plage_r, v_vs_r, noeval, declared = [], [], [], [], [], []
    for p, v in vs:   # v hors de sa plage sans ecart : toutes les valeurs, avec ou sans code
        pl = v.get('plage')
        if pl and all(is_num(x) for x in pl) and not v.get('ecart'):
            vn = nums(v.get('v'))
            if vn and (min(vn) < min(pl) - 1e-9 or max(vn) > max(pl) + 1e-9): plage_v.append(('/'.join(p), v['v'], pl))
    for p, v in coded + consts:
        path = '/'.join(p)
        live = read_const(v) if v['code'] == 'const' else r['values'][v['code']]
        if not live['ok']:
            noeval.append((path, v['code'], live['err'])); continue
        if not same(v.get('retenu'), live['v']): mism.append((path, v['code'], v.get('retenu'), live['v']))
        has_ecart = bool(v.get('ecart'))
        pl = v.get('plage')
        pn = nums(pl) if pl and all(is_num(x) for x in pl) else None
        if pn:
            lo, hi = min(pn), max(pn)
            vn = nums(v.get('v'))
            rn = nums(live['v'])
            if rn and (min(rn) < lo - 1e-9 or max(rn) > hi + 1e-9) and not has_ecart: plage_r.append((path, live['v'], pl))
        vn, rn = nums(v.get('v')), nums(live['v'])
        if vn and rn and len(vn) == len(rn) and not same(vn, rn, 0.02) and not has_ecart and not (pn and all(lo - 1e-9 <= x <= hi + 1e-9 for x in rn for lo, hi in [(min(pn), max(pn))])):
            v_vs_r.append((path, v['v'], live['v']))
    # ecarts declares (code ou plage)
    for p, v in vs:
        if v.get('ecart') and (isinstance(v.get('code'), str) or v.get('plage')):
            declared.append(('/'.join(p), v['ecart']))
    return dict(coded=len(coded) + len(consts), consts=len(consts), exprs=len(exprs), nopath=['/'.join(p) for p, v in nopath], mism=mism, plage_v=plage_v, plage_r=plage_r, v_vs_r=v_vs_r, noeval=noeval,
                declared=declared, load=load)


def numeric(x):
    """a value the drawing must carry: a number, a list of numbers, or a law / profile (lists of numbers)"""
    if is_num(x): return True
    if isinstance(x, list) and x:
        return all(is_num(y) or (isinstance(y, list) and y and all(is_num(z) for z in y)) for y in x)
    return False


def unlinked(f, groupe):
    """--lien tete|plante|tout: the numeric values of the drawn organs of that group with neither `code` (an expression, or "const" + `ligne`)
    nor a typed `ecart`: the fiche is not tied to the drawing there (pipe.py, end of forme and plante)"""
    roles, out = GROUPES[groupe], []
    for oname, o in (f.get('organes') or {}).items():
        if not isinstance(o, dict) or o.get('role') not in roles or o.get('dessinee') is False:
            continue
        for p, v in walk_vs(o, [oname]):
            if numeric(v.get('v')) and not isinstance(v.get('code'), str) and not v.get('ecart'):
                out.append('/'.join(p))
    return out


# ------------------------------------------------------------------------------------------------------------------ 4. couverture
def coverage(f):
    orgs = f['organes']
    table = OrderedDict()
    detail = OrderedDict()
    for oname, o in orgs.items():
        row, det = OrderedDict(), OrderedDict()
        app = ROLE_RUBRIQUES.get(o.get('role'), [])
        for rub in RUBRIQUES:
            if rub not in o:
                row[rub] = 'M' if rub in app else '.'
                continue
            node = expand_suit(o[rub], orgs)
            letters = [classify(v) for p, v in walk_vs(node, [])]
            known = [x for x in letters if x != 'M']
            if not known:
                row[rub] = 'M'; det[rub] = Counter(letters); continue
            row[rub] = max(known, key=lambda x: RANK[x]) + ('*' if 'M' in letters else '')
            det[rub] = Counter(letters)
        table[oname] = row
        detail[oname] = det
    return table, detail


# ------------------------------------------------------------------------------------------------------------------ rapport
def main():
    ap = argparse.ArgumentParser(description='controle d\'une fiche morphologique fiche-morpho/1')
    ap.add_argument('cmd', choices=['check'])
    ap.add_argument('sid')
    ap.add_argument('--no-code', action='store_true', help="ne pas evaluer les expressions `code` (pas de node)")
    ap.add_argument('--quiet', action='store_true', help="n'imprime que les erreurs et la synthese")
    ap.add_argument('--lien', choices=sorted(GROUPES), help="chaque valeur chiffree des organes dessines du groupe porte `code` ou `ecart` (fin de forme : tete ; fin de plante : tout)")
    a = ap.parse_args()
    try: sys.stdout.reconfigure(encoding='utf-8')
    except Exception: pass
    if a.sid.endswith('.json'):   # un chemin de fichier (essais) : le sid est le nom du fichier
        path = os.path.abspath(a.sid); a.sid = os.path.splitext(os.path.basename(path))[0]
    else:
        path = os.path.join(FICHES, a.sid + '.json')
    if not os.path.exists(path):
        out('fiche absente : ' + os.path.relpath(path, ROOT)); return 2
    try:
        f = json.load(open(path, encoding='utf-8'))
    except Exception as e:
        out('JSON invalide : %s' % e); return 1
    if b'\r' in open(path, 'rb').read(): out('avertissement : la fiche contient des CR (fin de ligne attendue : LF)')
    errs, warns = [], []
    out('=== fiche %s (%s) ===' % (a.sid, os.path.relpath(path, ROOT) if path.startswith(ROOT) else path))

    # 1
    nv, cited = check_schema(f, a.sid, errs, warns)
    out('\n[1] SCHEMA : %d valeurs V, %d organes, %d photos au registre (%d citees), %d variétés, %d stades, %d questions'
        % (nv, len(f.get('organes', {})), len(f.get('photos', {})), len(set(cited)), len(f.get('varietes', {})), len((f.get('stades') or {}).get('table', [])), len(f.get('questions', []))))
    for w in warns: out('  avertissement : ' + w)
    for e in errs: out('  ERREUR : ' + e)
    if not errs: out('  schéma valide')

    if errs and not f.get('organes'):
        return 1

    # 2
    res, weak = provenance(f)
    nC = sum(1 for _, v in walk_vs(f['organes'], []) if v['methode'] == 'code')
    nH = sum(1 for _, v in walk_vs(f['organes'], []) if v['methode'] == 'hypothese')
    out('\n[2] VALEURS SANS PROVENANCE (methode code ou hypothese) : %d code, %d hypothèse ; %d à l\'œil/segmentées sans photo' % (nC, nH, len(weak)))
    if not a.quiet:
        cur = None
        for (o, r), items in sorted(res.items(), key=lambda kv: (list(f['organes']).index(kv[0][0]), RUBRIQUES.index(kv[0][1]) if kv[0][1] in RUBRIQUES else 99)):
            if o != cur: out('  %s' % o); cur = o
            for lab, m, etat in items: out('    %-11s %-34s %-9s %s' % (r, lab[:34], m, etat))
        if weak:
            out('  à l\'œil ou segmentées SANS photo (source globale seulement) :')
            for o, r, lab, m in weak: out('    %-16s %-11s %-34s %s' % (o, r, lab[:34], m))

    # 3
    code_ok = True
    if a.no_code:
        out('\n[3] CODE : non évalué (--no-code)')
    else:
        c = check_code(f, errs, warns)
        if c is None:
            out('\n[3] CODE : évaluation impossible'); [out('  ERREUR : ' + e) for e in errs[-1:]]; code_ok = False
        else:
            ld = c['load']
            out('\n[3] CODE : %d expressions évaluées pour %d valeurs (application chargée : %d fichiers, %s)' % (c['exprs'], c['coded'], ld.get('files', 0), 'sans erreur' if not ld.get('failed') else '%d erreur(s)' % len(ld['failed'])))
            out('  constantes en dur relues à leur ligne (code « const ») : %d' % c['consts'])
            out('  valeurs « code » sans chemin évaluable (constante en dur dans une fonction) : %d' % len(c['nopath']))
            if not a.quiet:
                for p in c['nopath']: out('    - ' + p)
            def show(title, lst, fmt):
                out('  %s : %d' % (title, len(lst)))
                for x in lst: out('    ! ' + fmt(x))
            show('retenu différent du code', c['mism'], lambda x: '%s : retenu %s, code %s [%s]' % (x[0], json.dumps(x[2]), json.dumps(x[3]), x[1][:50]))
            show('v hors de sa plage sans écart écrit', c['plage_v'], lambda x: '%s : v %s hors %s' % x)
            show('code hors de la plage sans écart écrit', c['plage_r'], lambda x: '%s : code %s hors %s' % x)
            show('v différent du code sans écart écrit', c['v_vs_r'], lambda x: '%s : v %s, code %s' % x)
            show('expressions non évaluables', c['noeval'], lambda x: '%s : %s -> %s' % x)
            out('  écarts DÉCLARÉS (divergences connues, avec `ecart` écrit) : %d' % len(c['declared']))
            if not a.quiet:
                for p, e in c['declared']:
                    e = ecart_txt(e)
                    out('    ~ %s\n        %s' % (p, e if len(e) < 300 else e[:297] + '...'))
            for lst, t in ((c['mism'], 'retenu != code'), (c['plage_v'], 'v hors plage'), (c['plage_r'], 'code hors plage'), (c['v_vs_r'], 'v != code'), (c['noeval'], 'expression non évaluable')):
                for x in lst: errs.append('code : %s : %s' % (t, x[0]))
            code_ok = not (c['mism'] or c['plage_v'] or c['plage_r'] or c['v_vs_r'] or c['noeval'])

    # 4
    table, detail = coverage(f)
    out('\n[4] COUVERTURE organe x rubrique (S sourcée, U chiffrée sans source, C code seul, M manquante ou inconnue, . sans objet pour ce rôle)')
    out('    %-16s %s' % ('', ' '.join('%-5s' % r[:5] for r in RUBRIQUES)))
    tot = Counter()
    for o, row in table.items():
        out('    %-16s %s' % (o, ' '.join('%-5s' % row[r] for r in RUBRIQUES)))
        for r in RUBRIQUES:
            if row[r] != '.': tot[row[r][0]] += 1
    n = sum(tot.values())
    out('    cases : %d applicables ; S %d (%d %%), U %d, C %d, M %d' % (n, tot['S'], round(100 * tot['S'] / max(1, n)), tot['U'], tot['C'], tot['M']))
    allv = Counter()
    for _, v in walk_vs(f['organes'], []): allv[classify(v)] += 1
    nvt = sum(allv.values())
    out('    valeurs des organes : %d ; S %d (%d %%), U %d, C %d, M %d' % (nvt, allv['S'], round(100 * allv['S'] / max(1, nvt)), allv['U'], allv['C'], allv['M']))
    if not a.quiet:
        out('    détail par case (nombre de valeurs S/U/C/M) :')
        for o, det in detail.items():
            out('      %-16s %s' % (o, '  '.join('%s %s' % (r[:5], ''.join('%s%d' % (k, det[r][k]) for k in 'SUCM' if det[r][k])) for r in det)))
    # variétés et stades
    vs_doc = [c for c, v in f['varietes'].items() if v.get('organes')]
    out('    variétés avec une description au-delà de « forme: espece » : %d sur %d (%s)' % (len(vs_doc), len(f['varietes']), ', '.join(vs_doc)))
    rows = (f.get('stades') or {}).get('table', [])
    out('    stades : %s' % ', '.join('%s=%s' % (r['stade'], r['statut']) for r in rows))
    out('    questions ouvertes : %d' % len(f.get('questions', [])))

    # 5 (--lien): the fiche tied to the drawing
    nl = None
    if a.lien:
        ul = unlinked(f, a.lien)
        nl = len(ul)
        out('\n[5] LIEN fiche -> code (%s : %s) : %d valeur(s) chiffrée(s) sans `code` ni `ecart`' % (a.lien, ', '.join(sorted(GROUPES[a.lien])), nl))
        for x in ul[:40]: out('    ! ' + x)
        if nl > 40: out('    ... et %d autres' % (nl - 40))
        errs.extend('lien : %s sans code ni ecart' % x for x in ul)

    nerr = len(errs)
    out('\n=> %s (%d erreur(s), %d avertissement(s))' % ('VALIDE' if nerr == 0 else 'NON VALIDE', nerr, len(warns)))
    # one JSON line last (read by pipe.py): the counts of the fiche
    meth = Counter(v.get('methode') for _, v in walk_vs(f['organes'], []))
    nvo = sum(meth.values())
    ecs = Counter(v['ecart'].get('type') for blk in (f['organes'], f['varietes'], f['stades']) for _, v in walk_vs(blk, []) if isinstance(v.get('ecart'), dict))
    out(json.dumps({'fiche': a.sid, 'valide': nerr == 0, 'erreurs': nerr, 'avertissements': len(warns), 'valeurs': nvo,
                    'mesures': sum(meth[m] for m in MESURES), 'code': meth['code'], 'code_pct': round(100 * meth['code'] / max(1, nvo), 1),
                    'hypothese': meth['hypothese'], 'photos': len(f.get('photos') or {}),
                    'roles': sorted({o.get('role') for o in f['organes'].values() if isinstance(o, dict) and o.get('role')}),
                    'ecarts': dict(ecs), 'non_relies': nl}, ensure_ascii=False))
    return 0 if nerr == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
