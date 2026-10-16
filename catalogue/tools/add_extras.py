# -*- coding: utf-8 -*-
"""Add the species seen in the reference bouquets but missing from the herbier to recettes/extras.json and ids.tsv."""
import json, os
R = r'C:\Users\agent\Desktop\flower\catalogue\recettes'
X = json.load(open(os.path.join(R, 'extras.json'), encoding='utf-8'))
have = {x['id'] for x in X}


def sp(id, nom, lat, cat, role, rec):
    if id not in have:
        X.append({"id": id, "nom_fr": nom, "latin": lat, "categorie": cat, "role": role, "recette": rec})
        have.add(id)


def S(cm, w, col, leaf):
    return {"cm": cm, "w": w, "col": col, "leaf": leaf}


sp("sandersonia", "Sandersonia (clochette de Noël)", "Sandersonia aurantiaca", "Exotiques", "ligne",
   {"a": "custom", "cm": 45, "stem": S(50, 3, "#5d8a3a", "lanceolate"), "cols": ["#ef9a2a", "#f4c24a", "#f2dfa8"], "p": {"fn": "xSanders"}, "price": 75})
sp("ail-serpent", "Ail serpent (Allium 'Snakeball')", "Allium sativum var. ophioscorodon", "Printemps & bulbes", "ligne",
   {"a": "custom", "cm": 50, "stem": S(55, 4, "#7a9a5a", "none"), "cols": ["#8aa860", "#b6c27a", "#6f8f6a"], "p": {"fn": "xSnake"}, "price": 40})
sp("lis-tigre", "Lis tigré", "Lilium lancifolium (syn. L. tigrinum)", "Été & classiques", "focale",
   {"a": "star", "cm": 10, "stem": S(80, 8, "#4a6a2e", "lanceolate"), "cols": ["#e8742a", "#f2c41e", "#d8402a", "#ec9a8a"], "c2": "#2a0c08",
    "p": {"n": 6, "w": 0.28, "a0": 45, "a1": 150, "ruf": 0.05, "spots": "#2a0c08", "stamens": 6, "anther": "#5a1a0c", "cluster": 3, "nod": 1}, "price": 60})
sp("lis-oriental-double", "Lis oriental double", "Lilium (hybrides orientaux doubles, série Roselily)", "Été & classiques", "focale",
   {"a": "double", "cm": 17, "stem": S(75, 9, "#4a7a35", "whorl"), "cols": ["#f2a6c4", "#faf6ee", "#f6e6b8", "#d8508a", "#f6d0dc"],
    "p": {"n": 22, "w": 0.34, "tip": "point", "a0out": 58, "a1out": 108, "a0in": 26, "a1in": 64, "cup": -0.22, "ruf": 0.1, "center": "closed"}, "price": 140})
sp("clematite-clochettes", "Clématite à clochettes", "Clematis integrifolia et hybrides ('Amazing', 'Rooguchi')", "Été & classiques", "secondaire",
   {"a": "cup", "cm": 4.5, "stem": S(50, 2.5, "#4f6e34", "lanceolate"), "cols": ["#6a3e8a", "#4a4aa0", "#c06a9a", "#f2eef0", "#8a2a5a"], "c2": "#f0e8d0",
    "p": {"n": 4, "w": 0.42, "a0": 10, "a1": 48, "cup": -0.35, "open": 0.45, "center": "stamens", "nod": 1}, "price": 75})
sp("pentas", "Pentas (étoile d'Égypte)", "Pentas lanceolata", "Été & classiques", "remplissage",
   {"a": "globe", "cm": 8, "stem": S(35, 3.5, "#4f7a34", "ovate"), "cols": ["#e8507a", "#f4f2f0", "#c0284a", "#e89ab8", "#9a5aa8"],
    "p": {"shape": "flat", "n": 36, "fl": {"a": "star", "cm": 1.3, "n": 5}}, "price": 40})
sp("geranium-vivace", "Géranium vivace", "Geranium (G. × oxonianum, G. 'Rozanne'…)", "Été & classiques", "remplissage",
   {"a": "spray", "cm": 20, "stem": S(40, 2.5, "#5a7a3a", "palmate"), "cols": ["#7a6ac8", "#e88aac", "#f4f0f2", "#a04aa0", "#5a5ab8"], "c2": "#f2eef6",
    "p": {"branches": 4, "n": 9, "fl": {"a": "radial", "cm": 3.6, "n": 5}, "shape": "airy", "len": 20}, "price": 40})
sp("coreopsis", "Coréopsis", "Coreopsis grandiflora et C. verticillata", "Été & classiques", "secondaire",
   {"a": "radial", "cm": 5, "stem": S(45, 2.5, "#4f7a34", "lanceolate"), "cols": ["#f2c21e", "#f6dc6a", "#e8902a", "#c0302a"], "c2": "#9a6a18",
    "p": {"n": 8, "w": 0.62, "tip": "teeth", "a0": 84, "a1": 96, "cup": -0.05, "layers": 1, "disc": {"r": 0.2, "h": 0.12, "type": "dome", "col": "#9a6a18"}}, "price": 25})
sp("bruyere", "Bruyère", "Erica (E. gracilis, E. carnea)", "Remplissage & textures", "texture",
   {"a": "spike", "cm": 18, "stem": S(35, 3, "#4a5a32", "needle"), "cols": ["#d0507a", "#f4f0ee", "#a04a8a", "#e89ab8"],
    "p": {"n": 60, "fl": {"a": "bell", "cm": 0.5, "n": 4}, "taper": 0.35, "buds": 6, "dense": 0.95, "side": 0}, "price": 25})
sp("gerbera-araignee", "Gerbera araignée", "Gerbera jamesonii (type spider, 'Pasta')", "Été & classiques", "secondaire",
   {"a": "radial", "cm": 11, "stem": S(50, 5, "#5f8a3e", "none"), "cols": ["#f2a07a", "#f4e8d8", "#f6c22a", "#e05a8a", "#d8302a", "#f2b8c8"], "c2": "#3a2a1e",
    "p": {"n": 46, "w": 0.07, "tip": "point", "a0": 78, "a1": 104, "cup": -0.55, "layers": 2, "disc": {"r": 0.24, "h": 0.08, "type": "flat", "col": "#3a2a1e"}}, "price": 40})
sp("cosmos-chocolat", "Cosmos chocolat", "Cosmos atrosanguineus", "Été & classiques", "accent",
   {"a": "radial", "cm": 4, "stem": S(40, 2, "#4a5a2a", "none"), "cols": ["#4a0a14", "#6a1a1e", "#2a0a10"], "c2": "#2a0a0a",
    "p": {"n": 8, "w": 0.5, "tip": "teeth", "a0": 80, "a1": 95, "cup": -0.15, "layers": 1, "disc": {"r": 0.22, "h": 0.12, "type": "dome", "col": "#2a0a0a"}}, "price": 75})
sp("fustet-plumes", "Fustet en plumes (arbre à perruques)", "Cotinus coggygria (inflorescences)", "Remplissage & textures", "texture",
   {"a": "spray", "cm": 25, "stem": S(50, 4, "#6a3a2a", "none"), "cols": ["#c9a0a6", "#8a4a5a", "#d8c8aa", "#b8b88a"],
    "p": {"branches": 10, "n": 200, "fl": {"a": "dot", "cm": 0.35}, "shape": "airy", "len": 25}, "price": 75})
sp("branche-lichen", "Branche lichénée", "Prunus spinosa ou Betula (rameau couvert de lichen)", "Branches & baies", "branche",
   {"a": "custom", "cm": 55, "stem": S(60, 6, "#6c655c", "none"), "cols": ["#b9c4a6", "#d6dcc8", "#9aa88a"], "p": {"fn": "xLichen"}, "price": 40})


def fol(id, nom, lat, cols, price, cm, col, leaf, lf, arr, n, ln):
    sp(id, nom, lat, "Feuillages", "feuillage",
       {"a": "foliage", "cm": cm, "stem": S(ln, 4, col, leaf), "cols": cols, "p": {"leaf": lf, "arr": arr, "n": n, "len": ln}, "price": price})


fol("pivoine-feuillage", "Feuillage de pivoine", "Paeonia lactiflora (feuilles)", ["#3e5e2a", "#5a3a2a"], 20, 14, "#7a3a2a", "palmate", {"shape": "palmate", "cm": 14, "gloss": 0.3}, "alternate", 4, 35)
fol("robinier", "Robinier (feuillage)", "Robinia pseudoacacia", ["#6a9a3a", "#c8b43a"], 20, 22, "#5a4a32", "pinnate", {"shape": "pinnate", "cm": 22}, "alternate", 5, 45)
fol("coleus", "Coléus", "Plectranthus scutellarioides (Solenostemon)", ["#a8c43a", "#6a1a3a", "#d0507a", "#b0582a", "#2a1420"], 40, 9, "#5a2a3a", "ovate", {"shape": "ovate", "cm": 9, "teeth": 1, "inner": "#5a1a32"}, "opposite", 5, 25)
fol("begonia-feuillage", "Bégonia rex (feuillage)", "Begonia rex-cultorum", ["#6a2a3a", "#4a5a3a", "#9a3a4a", "#3a2a30"], 75, 16, "#7a2a30", "cordate", {"shape": "cordate", "cm": 16, "w": 0.75, "teeth": 1, "inner": "#c8c4cc"}, "rosette", 3, 25)
fol("vigne-feuilles", "Feuilles de vigne (automne)", "Vitis vinifera (feuillage rougi)", ["#b0242a", "#d0602a", "#8a1a3a", "#4a6a2a"], 25, 12, "#7a3a2a", "lobed", {"shape": "lobed", "cm": 12, "teeth": 1}, "alternate", 6, 45)
fol("fusain-aile", "Fusain ailé (feuillage d'automne)", "Euonymus alatus", ["#d0405a", "#b0202a", "#e07a5a", "#c86a8a"], 40, 5, "#6a5a4a", "elliptic", {"shape": "elliptic", "cm": 5, "teeth": 1}, "opposite", 12, 45)
fol("calla-feuilles", "Feuilles de calla", "Zantedeschia (feuilles maculées)", ["#3e6a2e", "#2e5a2a"], 25, 24, "#4e7a34", "cordate", {"shape": "cordate", "cm": 24, "w": 0.52, "spots": "#e4ecd8", "gloss": 0.3}, "single", 1, 45)
fol("anthurium-cristal", "Anthurium cristal (feuille veloutée)", "Anthurium crystallinum et A. clarinervium", ["#1f3a26", "#2e4a2a"], 140, 28, "#3a4a2a", "cordate", {"shape": "cordate", "cm": 28, "w": 0.8, "c2": "#e4ecdc"}, "single", 1, 45)
fol("hellebore-feuilles", "Feuilles d'hellébore", "Helleborus × hybridus (feuilles)", ["#2e4a26", "#3e5a2e"], 25, 15, "#4a5a2a", "palmate", {"shape": "palmate", "cm": 15, "teeth": 1, "gloss": 0.5}, "rosette", 3, 30)
fol("chrysantheme-feuilles", "Feuillage de chrysanthème", "Chrysanthemum × morifolium (feuilles)", ["#4e6a3a", "#5a6a4a"], 20, 8, "#4a6a34", "lobed", {"shape": "lobed", "cm": 8, "teeth": 1}, "alternate", 12, 40)
fol("gloriosa-feuillage", "Liane de gloriosa (feuillage)", "Gloriosa superba (tiges feuillées à vrilles)", ["#3e6a2a", "#5a7a2a"], 25, 12, "#4a7a34", "lanceolate", {"shape": "lanceolate", "cm": 12, "gloss": 0.5}, "alternate", 10, 55)

with open(os.path.join(R, 'extras.json'), 'w', encoding='utf-8', newline='') as fh:
    json.dump(X, fh, ensure_ascii=False, indent=1)
    fh.write('\n')

lines = open(os.path.join(R, 'ids.tsv'), encoding='utf-8').read().rstrip('\n').split('\n')
known = {l.split('\t')[0] for l in lines}
for x in X:
    if x['id'] not in known:
        lines.append('\t'.join([x['id'], x['nom_fr'], x['categorie'], x['role']]))
open(os.path.join(R, 'ids.tsv'), 'w', encoding='utf-8', newline='').write('\n'.join(lines) + '\n')
cat = json.load(open(os.path.join(R, '..', 'catalogue.json'), encoding='utf-8'))
clash = [x['id'] for x in X if any(c['id'] == x['id'] for c in cat)]
print(len(X), 'extras; ids.tsv', len(lines), 'lines; clashes with herbier:', clash)
