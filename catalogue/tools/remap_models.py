# -*- coding: utf-8 -*-
"""Point the reference-bouquet recipes at the newly drawn species instead of the nearest stand-ins."""
import json, os
R = r'C:\Users\agent\Desktop\flower\catalogue\recettes'
# (bouquet n, old id, colour or None for every element of that id) -> new id
MAP = [
    (1, 'ruscus-seche-teint', None, 'fusain-aile'),
    (2, 'amour-en-cage', None, 'sandersonia'), (2, 'bouvardia', None, 'pentas'),
    (6, 'photinia-red-robin', '#9a3a3c', 'begonia-feuillage'), (6, 'photinia-red-robin', '#3a1418', 'coleus'),
    (7, 'cotinus-coggygria-arbre-a-perruques', None, 'fustet-plumes'),
    (8, 'clematite', '#8a74a0', 'clematite-clochettes'),
    (12, 'amour-en-cage', None, 'sandersonia'),
    (15, 'cosmos', '#5c0f22', 'cosmos-chocolat'),
    (18, 'danae-racemosa-ruscus-italien', None, 'hellebore-feuilles'),
    (19, 'allium-petit', None, 'ail-serpent'), (19, 'gerbera', None, 'gerbera-araignee'),
    (21, 'allium-petit', None, 'ail-serpent'),
    (25, 'bouleau', None, 'branche-lichen'),
    (27, 'godetia-clarkia', None, 'geranium-vivace'),
    (30, 'lis-asiatique-la', None, 'lis-tigre'),
    (31, 'bouvardia', None, 'pentas'), (31, 'anthurium-feuilles', None, 'calla-feuilles'), (31, 'cosmos', '#3a1418', 'cosmos-chocolat'),
    (35, 'lis-asiatique-la', None, 'lis-tigre'),
    (36, 'waxflower', None, 'bruyere'),
    (40, 'lis-oriental', '#efe2b8', 'lis-oriental-double'),
    (43, 'choisya-ternata-oranger-du-mexique', None, 'pivoine-feuillage'),
    (48, 'lis-oriental', None, 'lis-oriental-double'),
    (49, 'allium-petit', None, 'ail-serpent'),
    (61, 'cosmos', '#f2c230', 'coreopsis'),
    (63, 'heuchera', None, 'vigne-feuilles'),
    (67, 'lis-asiatique-la', None, 'lis-tigre'),
    (68, 'allium-petit', None, 'ail-serpent'),
    (70, 'allium-petit', None, 'ail-serpent'),
    (71, 'physocarpus-opulifolius', None, 'chrysantheme-feuilles'),
    (72, 'amour-en-cage', None, 'sandersonia'), (72, 'allium-petit', None, 'ail-serpent'),
    (74, 'lis-oriental', None, 'lis-oriental-double'), (74, 'danae-racemosa-ruscus-italien', None, 'gloriosa-feuillage'),
    (76, 'clematite', '#74405e', 'clematite-clochettes'),
    (79, 'anthurium-feuilles', None, 'anthurium-cristal'),
    (81, 'allium-petit', None, 'ail-serpent'), (81, 'danae-racemosa-ruscus-italien', None, 'gloriosa-feuillage'),
    (81, 'pistacia-lentiscus-pistachier', None, 'robinier'),
]
ids = {l.split('\t')[0] for l in open(os.path.join(R, 'ids.tsv'), encoding='utf-8')}
used = [0] * len(MAP)
for i in range(1, 5):
    p = os.path.join(R, f'bouquets_0{i}.json')
    d = json.load(open(p, encoding='utf-8'))
    for b in d:
        for e in b['els']:
            for j, (n, old, col, new) in enumerate(MAP):
                if b['n'] == n and e['id'] == old and (col is None or e['col'].lower() == col):
                    assert new in ids, new
                    e['id'] = new
                    used[j] += 1
                    break
    with open(p, 'w', encoding='utf-8', newline='') as fh:
        json.dump(d, fh, ensure_ascii=False, indent=2)
        fh.write('\n')
miss = [MAP[j] for j, u in enumerate(used) if not u]
print(sum(used), 'elements remapped; rules never applied:', miss)
