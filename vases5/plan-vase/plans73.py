"""Step 6: the plan of the 73 vessels (qa/plans73.json, from plans73.js) -> which ones need a measure of their own, a table and a sheet of
sections. python vases5/plan-vase/plans73.py -> plans73.md (table) + planche-etape6.svg (sections, frames coloured by verdict)"""
import json, os, math

D = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(os.path.join(D, 'qa', 'plans73.json'), encoding='utf8'))
CM = 6.5


def flags(r):
    """(verdict, reasons): 'hors' the plan does not apply, 'mesure' its cavity must be measured apart, 'voir' to check, 'ok'"""
    if r['kind'] == 'kenzan':
        return 'hors', ['pique-fleurs : les tiges sont piquées, pas posées au fond (plan non appliqué)']
    if r['m2']:
        return 'hors', ['plusieurs bouches : plan non appliqué (composeMouths)']
    m, v = [], []
    lip = max(r['mo'], 1)
    src = r.get('src', 'profil')
    if src in ('glb', 'contour', 'boite'):
        why = {'glb': 'cavité mesurée sur le modèle 3D', 'contour': 'coupe tirée du contour de la photo', 'boite': 'cavité carrée de la colonne'}[src]
        if max(r['edge']) > 55:
            v.append('très ouvert (%.0f°) : sans pique, les tiges se couchent' % max(r['edge']))
        if r['n6'] < 5:
            v.append('col minuscule : %d tiges de 6 mm au plus' % r['n6'])
        return ('voir' if v else 'mesuré'), [why] + v
    if src == 'suppose':
        return 'voir', ['modèle 3D non creusé : cavité supposée (droite, largeur de la bouche), à confirmer sur une photo de l’intérieur']
    if r['sil'] and r['rOutAtMouth'] > 1.5 * lip:
        m.append('sculpté : le profil à la bouche (%.1f cm) est la sculpture, pas la paroi ; cavité à mesurer sur le modèle 3D' % (r['rOutAtMouth'] / CM))
    elif r['sil']:
        v.append('sculpté : cavité lue sur le profil extérieur, à confirmer sur le modèle 3D')
    if r['shape'] in ('outline', 'box'):
        m.append('forme non tournée (%s) : le profil n\'est qu\'une coupe, la bouche est %s' % (r['shape'], 'un rectangle' if r['box'] else 'allongée'))
    if r['mat'] == 'glass' and not r['cavb']:
        m.append('verre sans cavité mesurée : les tiges vues dedans suivent une paroi estimée')
    if not r['sil'] and r['rOutAtMouth'] > 1.6 * lip:
        m.append('épaule fermée : bouche %.1f cm pour un corps de %.1f cm à sa hauteur, à vérifier sur la photo' % (r['mo'] / CM, r['rOutAtMouth'] / CM))
    if r['D'] < 3 * CM:
        m.append('profondeur utile %.1f cm : fond mal lu ou coupe plate' % (r['D'] / CM))
    if r['yF'] > .5 * r['yM']:
        v.append('fond haut (%.0f %% de la hauteur) : pied plein supposé' % (100 * r['yF'] / r['yM']))
    if r['rE'][1] < .5 * r['rM']:
        v.append('col plus étroit que la moitié de la lèvre : les tiges s\'appuient sur le col')
    if max(r['edge']) > 55:
        v.append('très ouvert (%.0f°) : sans pique, les tiges se couchent' % max(r['edge']))
    C = r.get('cav') or []
    if len(C) > 4:
        lo = [q for q in C if q[0] < r['yF'] + .5 * r['D']]
        for i in range(1, len(lo)):
            above = max(q[1] for q in C[i:])
            below = max(q[1] for q in C[:i])
            if lo[i][1] < .6 * above and below > 1.3 * lo[i][1]:
                v.append('étranglement bas (%.1f cm à %.0f %% de la hauteur) : pied plein ou cavité ? fond à vérifier sur la photo' % (2 * lo[i][1] / CM, 100 * lo[i][0] / r['yM']))
                break
    if r['n6'] < 5:
        v.append('col minuscule : %d tiges de 6 mm au plus' % r['n6'])
    return ('mesure' if m else 'voir' if v else 'ok'), m + v


rows = []
for r in R:
    vd, why = flags(r)
    rows.append((r, vd, why))
order = {'mesure': 0, 'voir': 1, 'mesuré': 2, 'hors': 3, 'ok': 4}
rows.sort(key=lambda t: (order[t[1]], t[0]['fam'], t[0]['id']))
cnt = {k: sum(1 for t in rows if t[1] == k) for k in order}

# ---- table
L = ['| Vase | Famille | Profondeur | Bouche Ø | Gorge Ø | Inclinaison max | Classe | Tiges de 6 mm | Verdict | Pourquoi |', '|---|---|---|---|---|---|---|---|---|---|']
for r, vd, why in rows:
    if r.get('plan') and r['kind'] != 'kenzan':
        L.append('| %s | %s | %.1f cm | %.1f cm | %.1f cm | %.0f° | %s | %d | %s | %s |' % (r['id'], r['fam'], r['D'] / CM, 2 * r['rM'] / CM, 2 * r['throat'][1] / CM,
                 max(r['edge']), r['cls'], r['n6'], vd, ' ; '.join(why) or '—'))
    else:
        L.append('| %s | %s | — | — | — | — | — | — | %s | %s |' % (r['id'], r['fam'], vd, ' ; '.join(why)))
open(os.path.join(D, 'plans73.md'), 'w', encoding='utf8', newline='\n').write(
    '# Plan des 73 vases (étape 6)\n\nVerdicts : %d à mesurer à part, %d à vérifier, %d hors du plan, %d sans remarque.\n\n' % (cnt['mesure'], cnt['voir'], cnt['hors'], cnt['ok']) + '\n'.join(L) + '\n')

# ---- sheet: one section per vessel, frame coloured by verdict
COL = {'mesure': '#c0392b', 'voir': '#d68910', 'mesuré': '#2e86c1', 'hors': '#7f8c8d', 'ok': '#5d8a3e'}
NC, CWD, CHT = 10, 150, 190
H = 60 + math.ceil(len(rows) / NC) * CHT + 20
g = []
for i, (r, vd, why) in enumerate(rows):
    x0, y0 = 10 + (i % NC) * CWD, 60 + (i // NC) * CHT
    P = r['prof']
    if not P:
        continue
    hmax = max(p[0] for p in P)
    rmax = max(p[1] for p in P)
    k = min(120 / max(hmax, 1), 62 / max(rmax, 1))
    cx, gy = x0 + CWD / 2, y0 + 150
    tx, ty = (lambda x: cx + x * k), (lambda h: gy - h * k)
    g.append('<rect x="%d" y="%d" width="%d" height="%d" rx="6" fill="#fbf8f2" stroke="%s" stroke-width="2"/>' % (x0 + 3, y0 + 3, CWD - 6, CHT - 6, COL[vd]))
    pts = ['%.1f,%.1f' % (tx(-p[1]), ty(p[0])) for p in P] + ['%.1f,%.1f' % (tx(p[1]), ty(p[0])) for p in reversed(P)]
    g.append('<polygon points="%s" fill="#d9d3c7" stroke="#8a8170" stroke-width=".6"/>' % ' '.join(pts))
    if r.get('cav'):
        C = r['cav']
        cp = ['%.1f,%.1f' % (tx(-q[1]), ty(q[0])) for q in C] + ['%.1f,%.1f' % (tx(q[1]), ty(q[0])) for q in reversed(C)]
        g.append('<polygon points="%s" fill="#ffffff" stroke="#4d7fa8" stroke-width=".7"/>' % ' '.join(cp))
        # the two most leaning stems, from the foot opposite to the lip, on beyond
        for s in (-1, 1):
            e = math.radians(r['edge'][0 if s < 0 else 1]) * s
            xe, ye = r['mx'] + s * r['rE'][0 if s < 0 else 1], r['yM']
            xf = xe - math.tan(e) * r['D']
            ext = 0.35 * r['yM']
            g.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#b5651d" stroke-width=".8"/>' % (tx(xf), ty(r['yF']), tx(xe + math.tan(e) * ext), ty(ye + ext)))
        th = r['throat']
        g.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#c0392b" stroke-width="1.2"/>' % (tx(-th[1]), ty(th[0]), tx(th[1]), ty(th[0])))
    g.append('<text x="%.1f" y="%d" font-size="9" text-anchor="middle" fill="#333">%s</text>' % (cx, y0 + 168, r['id'][:26]))
    g.append('<text x="%.1f" y="%d" font-size="8.5" text-anchor="middle" fill="%s">%s</text>' % (cx, y0 + 180, COL[vd],
             {'mesure': 'à mesurer', 'voir': 'à vérifier', 'mesuré': 'mesuré à part', 'hors': 'hors du plan', 'ok': 'ok'}[vd] + ('' if not r.get('cls') or r['kind'] == 'kenzan' else ' · ' + r['cls'])))
W = 20 + NC * CWD
svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" font-family="Segoe UI,Arial,sans-serif"><rect width="100%%" height="100%%" fill="#f4efe6"/>'
       '<text x="12" y="28" font-size="17" font-weight="bold" fill="#222">Plan du vase, étape 6 : les 73 vases (coupe, cavité en bleu, gorge en rouge, tiges les plus penchées en brun)</text>'
       '<text x="12" y="48" font-size="12" fill="#555">rouge : à mesurer (%d) · bleu : mesuré à part (%d) · orange : à vérifier (%d) · gris : hors du plan (%d) · vert : sans remarque (%d)</text>%s</svg>') % (W, H, W, H, cnt['mesure'], cnt['mesuré'], cnt['voir'], cnt['hors'], cnt['ok'], ''.join(g))
open(os.path.join(D, 'planche-etape6.svg'), 'w', encoding='utf8', newline='\n').write(svg)
print(cnt, W, H)
