"""Extract the reviewed visual vocabulary and compose 400 native SVG sketches."""
import json
import math
import random
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REFS = ROOT.parent
(ROOT / 'svg').mkdir(parents=True, exist_ok=True)
records = json.loads((REFS / 'inventaire.json').read_text(encoding='utf-8'))
notes = {line.split('|')[0]:line.split('|') for line in (REFS / 'analyses.tsv').read_text(encoding='utf-8').splitlines()}

# Material and period labels are visual readings, not new provenance assertions.
TRAITS = '''001|verre|Contemporain organique|ovoïde|ornements rapportés
002|verre recyclé|Géométrie contemporaine|blocs superposés|décalages
003|verre sommerso|Verre de studio|goutte asymétrique|poche suspendue
004|émail sur métal|Japonisme|globulaire|cloisonné et poissons
005|verre satiné probable|Contemporain organique|ovoïde|feuillage en relief
006|verre teinté|Géométrie contemporaine|tronçons empilés|polychromie
007|céramique émaillée|Sculptural contemporain|visage|relief figuratif
008|métal probable|Art déco|tours anguleuses|architecture
009|porcelaine jasper|Classique décoratif|ovoïde|relief floral blanc
010|porcelaine probable|Contemporain organique|globulaire|fleur rapportée
011|pâte de verre|Contemporain organique|corolle|relief translucide
012|verre teinté|Géométrie contemporaine|pavés|mosaïque
013|verre moulé|Art déco|tronconique|bas-relief figuratif
014|bronze probable|Japonisme|balustre|poissons en relief
015|porcelaine|Art nouveau|élancé|fleurs sculptées
016|métal probable|Décoratif géométrique|balustre|perles en spirale
017|porcelaine|Japonisme|quadrangulaire|bambou peint
018|céramique ou verre|Sculptural contemporain|éventail|figure et corolle
019|céramique ou métal|Contemporain organique|ovoïde|orchidées en couronne
020|céramique émaillée|Japonisme|bouteille côtelée|dragon appliqué
021|céramique|Contemporain organique|élancé|narcisses en relief
022|verre|Verre de studio|double coque|enroulement
023|porcelaine fine|Art nouveau|élancé|oiseaux et végétaux peints
024|émail sur métal|Japonisme|balustre|grues et cloisonné
025|verre ou céramique|Contemporain organique|sculpture|serpent enroulé
026|verre probable|Contemporain organique|double pointe|papillon
027|verre|Géométrie contemporaine|conique|anneaux obliques
028|métal et céramique|Contemporain organique|ovoïde|cage de branches
029|métal et verre|Art nouveau|globulaire|monture ajourée
030|verre irisé|Art nouveau|torsadé|fleurs émaillées
031|verre et argent|Art nouveau|globulaire|réseau floral métallique
032|céramique et métal|Art nouveau|bouteille|monture de gui
033|verre sommerso|Verre de studio|cylindre|poche colorée
034|céramique et étain|Art nouveau|ovoïde|anses et monture
035|jade ou porcelaine|Tradition chinoise|balustre|dragon sculpté
036|bronze probable|Japonisme|cylindre|socle sculptural
037|céramique|Céramique de studio|ovoïde|émail cristallin
038|céramique mate|Art nouveau|colonne|nervures et appuis
039|verre camée|Art nouveau|globulaire|orchidées
040|émail sur métal|Japonisme|pot|chardon et cloisonné
041|céramique probable|Art nouveau|ovoïde ajouré|feuilles structurelles
042|céramique|Céramique de studio|ovoïde|émail cristallin
043|émail sur métal|Japonisme|balustre|hortensias
044|cristal|Géométrie contemporaine|asymétrique|facettes
045|bronze probable|Japonisme|globulaire ajouré|oiseaux structurels
046|cristal gravé|Géométrie contemporaine|facetté|poisson gravé
047|bronze et argent|Japonisme|bouteille|bambou incrusté
048|émail sur métal|Japonisme|balustre|fleur et contraste
049|métal ou céramique|Décoratif minimal|ovoïde|ponctuation dorée
050|céramique irisée|Art nouveau|corolle|bord recourbé
051|émail sur métal|Japonisme|balustre|frise de grues
052|verre camée|Art nouveau|bouteille|lierre et col évasé
053|verre camée|Art nouveau|élancé|paysage
054|verre sommerso|Verre de studio|goutte|double poche
055|pâte de verre|Contemporain organique|corolle|feuillage et replis
056|céramique|Art nouveau|coupe|anses intégrées et ajours
057|verre camée|Art nouveau|bouteille|fleurs et bord festonné
058|émail sur métal|Japonisme|bouteille|dragon et bordures
059|verre|Verre de studio|ovoïde|inclusions
060|verre teinté|Verre de studio|bouteille|rubans colorés
061|céramique barbotine|Art nouveau|globulaire|fleurs appliquées
062|céramique ou verre|Art nouveau|élancé|iris et feuilles
063|porcelaine|Art nouveau|élancé|arums et lignes verticales
064|céramique|Contemporain organique|bouteille|nervures et fenêtres
065|bronze probable|Japonisme|balustre|carpe et eau
066|céramique|Art nouveau|corolle|libellule sculptée
067|céramique mate|Art nouveau|ovoïde|lierre appliqué
068|porcelaine|Art nouveau revisité|élancé|ginkgo en relief
069|métal probable|Art déco|coupe polygonale|triangles et pied
070|céramique probable|Sculptural contemporain|visage|couronne florale
071|verre camée|Art nouveau|ovoïde|clématites en relief
072|cristal ou verre|Géométrie contemporaine|prisme|cavité suspendue
073|céramique|Art nouveau|balustre|anses et ginkgo
074|céramique ou métal|Contemporain organique|ovoïde ajouré|réseau sculpté
075|cristal|Géométrie contemporaine|prisme|facettes et cavité
076|verre moulé|Art déco|globulaire|serpent et écailles
077|verre ou cristal moulé|Art déco|globulaire|volutes végétales
078|émail sur métal|Japonisme|balustre|fleurs en frise
079|céramique émaillée|Céramique de studio|cylindre|tripode et coulures
080|métal probable|Art nouveau|quadrangulaire|anses ajourées
081|porcelaine probable|Art nouveau|élancé|cygnes en relief
082|verre ou céramique|Géométrie contemporaine|tours|blocs colorés
083|porcelaine|Classique décoratif|globulaire|fleurs appliquées
084|métal argenté|Art nouveau|urne|anses et cartouches
085|cuivre ou laiton|Art nouveau|globulaire|martelage et pieds
086|céramique ou métal|Géométrie contemporaine|profils étagés|anneaux
087|verre probable|Verre de studio|torsadé|spirale et col
088|métaux mixtes|Japonisme|bouteille|bambou incrusté
089|céramique|Tradition utilitaire|bouteille|anse et émail
090|verre camée|Art nouveau|ovoïde|capucines
091|pâte de verre|Contemporain organique|goutte|pensées sculptées
092|émail sur métal|Japonisme|balustre|dahlia et branches
093|céramique|Céramique de studio|goutte|émail cristallin
094|porcelaine|Tradition chinoise|balustre|dragon bleu et blanc
095|céramique|Sculptural contemporain|visages|têtes jointives
096|porcelaine ou céramique|Sculptural contemporain|balustre|lapins appliqués
097|verre ou acrylique|Géométrie contemporaine|prisme|dégradés et biseaux
098|céramique|Céramique de studio|ovoïde lobé|cristallisations
099|verre camée|Art nouveau|ovoïde|ombelles et bord
100|porcelaine|Tradition chinoise|balustre|dragon peint
101|céramique ou métal|Sculptural contemporain|figure|drapé et socle
102|céramique|Art nouveau|balustre|chauve-souris et baies
103|céramique et métal|Art nouveau|balustre|visage et monture
104|cristal|Géométrie contemporaine|ovoïde facetté|taille et base claire
105|céramique|Céramique de studio|globulaire|craquelures
106|verre camée|Art nouveau|ovoïde|chardon
107|céramique barbotine|Art nouveau|corolle|branches et reptile
108|cristal|Géométrie contemporaine|prisme étagé|décrochés
109|verre sommerso|Verre de studio|goutte|poche colorée
110|porcelaine jasper|Classique décoratif|globulaire|magnolia en relief
111|verre ou cristal|Géométrie contemporaine|quadrangulaire|chanfreins et poche
112|verre et argent|Art nouveau|globulaire|monture végétale
113|verre camée|Art nouveau|bouteille|oiseaux et feuillage
114|céramique ou métal|Décoratif organique|élancé|frise de ginkgo
115|verre|Géométrie contemporaine|bloc|torsade interne
116|céramique émaillée|Japonisme|globulaire|oiseaux fleurs et craquelures'''

FAMILIES = [
 ('Feuillage',['Ginkgo','Lierre','Feuilles de chêne','Lotus'],[5,32,41,52,55,67,68,73,77,114],[1,5,9,4],['Art nouveau','Organique contemporain']),
 ('Corolles',['Iris','Magnolia','Arum','Pétales'],[9,10,11,15,19,21,39,50,57,61,62,63,66,71,78,83,90,91,92,99,106,110],[4,1,5,6],['Art nouveau','Organique contemporain']),
 ('Lianes',['Gui','Bambou','Ramures','Vrilles'],[28,29,31,32,34,47,64,73,80,84,88,103,107,112],[9,12,4,0],['Art nouveau','Japonisme']),
 ('Oiseaux',['Hirondelles','Grues','Cygnes','Oiseaux de rive'],[23,24,45,51,81,113,116],[4,8,12,13],['Japonisme','Classique décoratif']),
 ('Insectes',['Libellule','Papillon','Abeille','Ailes fines'],[26,66],[1,4,9,10],['Art nouveau','Organique contemporain']),
 ('Bestiaire',['Dendrobates','Gecko','Lapins','Chauve-souris'],[1,25,76,96,102,107],[9,5,4,6],['Organique contemporain','Art nouveau']),
 ('Eau et poissons',['Carpes','Vagues','Poisson-lune','Remous'],[4,14,36,46,65],[9,0,12,8],['Japonisme','Art déco']),
 ('Dragons',['Dragon de nuage','Dragon de rivière','Dragon stylisé','Écailles'],[20,35,58,94,100],[8,4,9,13],['Japonisme','Classique décoratif']),
 ('Facettes',['Prismes','Éclats','Cristal taillé','Plans obliques'],[44,46,69,72,75,97,104,108,111,115],[3,0,12,11],['Art déco','Géométrie contemporaine']),
 ('Architecture',['Contreforts','Colonnes','Arches','Portiques'],[8,36,38,64,80],[5,9,6,12],['Art nouveau','Art déco']),
 ('Empilements',['Anneaux','Blocs décalés','Paliers','Disques'],[2,6,12,27,82,86,108],[0,4,11,6],['Géométrie contemporaine','Art déco']),
 ('Figures',['Masque','Profil','Drapé','Visages'],[7,13,18,70,95,101,103],[4,9,5,12],['Sculptural contemporain','Art déco']),
 ('Paysages',['Sous-bois','Rivage','Marais','Horizon'],[53,99,113],[14,4,6,0],['Art nouveau','Classique décoratif']),
 ('Cloisonné',['Rosaces','Fleurs incrustées','Bambous dorés','Médaillons'],[4,17,24,40,43,48,51,58,78,92,94,100,116],[8,11,10,4],['Japonisme','Art déco']),
 ('Cristallisations',['Cristaux étoilés','Émail nuagé','Craquelures','Coulures'],[37,42,93,98,105,116],[7,6,5,4],['Céramique de studio','Organique contemporain']),
 ('Textures de métal',['Martelage','Perles','Poussière d’or','Stries'],[16,49,85],[9,10,11,12],['Art nouveau','Art déco']),
 ('Ajours',['Dentelle','Branches évidées','Fenêtres','Treillis'],[28,29,34,41,45,56,74,84],[15,9,4,5],['Art nouveau','Organique contemporain']),
 ('Inclusions',['Bulles','Poche de couleur','Nuage suspendu','Gouttes'],[3,33,54,59,60,109,115],[0,1,2,3],['Verre de studio','Géométrie contemporaine']),
 ('Torsions',['Ruban','Coques','Spirale','Onde'],[3,22,26,30,87,115],[0,2,4,9],['Verre de studio','Organique contemporain']),
 ('Essentiels',['Silence','Équilibre','Col fin','Volume pur'],[33,37,42,49,59,60,79,89,93,97,98,104,105,109,111],[0,5,6,4],['Minimalisme','Céramique de studio']),
]
MATERIALS = [
 ('Verre teinté','glass',['#bb7684','#659b9a','#ac914d','#8174a1']),
 ('Verre satiné','frost',['#b2ce8e','#b1c6d2','#cfa7b4','#d0b87b']),
 ('Verre irisé','glass',['#4d9e9c','#8197b9','#ae9064','#808db0']),
 ('Cristal taillé','glass',['#9881af','#8eacb8','#c0a37a','#a2abb0']),
 ('Porcelaine','ceramic',['#f0eadc','#7997aa','#bdc0b0','#d6adbb']),
 ('Céladon','ceramic',['#8daa94','#b4c1a3','#82a9a3','#c0c7b5']),
 ('Grès émaillé','ceramic',['#846a58','#72867b','#a69c85','#647c89']),
 ('Émail cristallin','ceramic',['#69a3ac','#ca9a6a','#aa8295','#86a5a3']),
 ('Émail cloisonné','ceramic',['#375e65','#ba8b76','#4d5256','#c9b97b']),
 ('Bronze patiné','metal',['#687c60','#967c53','#597869','#7d6848']),
 ('Cuivre','metal',['#b48066','#8fa897','#9c674b','#c59a84']),
 ('Laiton','metal',['#b7a273','#a29570','#c6b88c','#897a50']),
 ('Argent','metal',['#aeb7b1','#a4adb7','#bdbbae','#929f98']),
 ('Pierre / jade','stone',['#8dac9a','#b4b2a6','#78989a','#c4b7a0']),
 ('Verre camée','cameo',['#9a7f99','#b2a36a','#648791','#b5998b']),
 ('Métal ajouré','metal',['#9a8b64','#728b77','#a7b2ab','#927b65']),
]
# Radius profiles run from lip to foot, in normalized screen height.
SHAPES = [
 ('Ovoïde',[(0,.33),(.14,.67),(.42,1),(.68,.88),(1,.35)],245,72),
 ('Goutte',[(0,.23),(.17,.3),(.52,.92),(.72,1),(1,.32)],268,70),
 ('Bouteille',[(0,.28),(.30,.23),(.39,.7),(.58,.88),(.84,.77),(1,.43)],277,68),
 ('Balustre',[(0,.45),(.18,.27),(.37,.76),(.58,1),(.82,.66),(1,.4)],261,76),
 ('Amphore',[(0,.48),(.18,.3),(.4,.88),(.64,.93),(1,.36)],250,77),
 ('Calice',[(0,.99),(.26,.79),(.55,.29),(.85,.14),(1,.56)],230,81),
 ('Coupe',[(0,1),(.3,.98),(.66,.62),(1,.36)],164,97),
 ('Bulbe',[(0,.26),(.43,.22),(.60,.79),(.80,1),(1,.42)],282,75),
 ('Cylindre',[(0,.67),(.3,.64),(.73,.66),(1,.62)],258,77),
 ('Jarre',[(0,.65),(.21,.99),(.56,1),(.86,.69),(1,.5)],224,83),
 ('Soliflore',[(0,.38),(.3,.3),(.7,.57),(.9,.7),(1,.42)],292,51),
 ('Conique',[(0,1),(.2,.91),(.63,.66),(1,.43)],229,79),
 ('Poire',[(0,.22),(.18,.26),(.56,.9),(.75,1),(1,.41)],247,83),
 ('Polyèdre',[(0,.45),(.18,.78),(.54,1),(.85,.68),(1,.38)],254,76),
 ('Étages',[(0,.38),(.12,.39),(.15,.71),(.3,.71),(.34,.92),(.5,.92),(.55,.8),(.72,.8),(.78,.56),(1,.56)],249,82),
 ('Corolle',[(0,1),(.21,.55),(.5,.78),(.8,.68),(1,.34)],231,82),
 ('Ondulé',[(0,.66),(.19,.86),(.36,.57),(.58,1),(.8,.73),(1,.43)],251,78),
 ('Asymétrique',[(0,.51),(.25,.75),(.54,1),(.83,.75),(1,.42)],256,78),
 ('Prisme',[(0,.64),(.19,.71),(.77,.71),(1,.56)],278,77),
 ('Arche',[(0,.42),(.22,.68),(.55,1),(.84,.76),(1,.44)],264,82),
]
FEET = ['Anneau','Trois pieds','Disque','Socle carré','Pied court']
LIPS = ['Rond','Lobé','Oblique','Évasé','Fin']
PERIODS = {
    'Art nouveau': 'Fin XIXe / début XXe (influence)',
    'Art déco': 'Entre-deux-guerres (influence)',
    'Japonisme': 'Fin XIXe / début XXe (influence)',
    'Classique décoratif': 'Répertoire classique, sans date unique',
}


def period_reading(ref, style):
    if ref['id']=='013': return 'Modèle Bacchantes : 1927 ; date de cet exemplaire non établie'
    if ref['id']=='076': return 'Modèle Serpent : 1924 ; date de cet exemplaire non établie'
    attribution=ref['attribution']
    if 'Meiji' in attribution:
        return 'Piste Meiji/Taishō non confirmée' if 'Taish' in attribution else 'Piste Meiji non confirmée'
    if style in PERIODS: return PERIODS[style]+' ; objet non daté'
    if any(word in style.lower() for word in ('contemporain','studio')): return 'Lecture moderne / contemporaine ; objet non daté'
    return 'Époque de l’objet non établie'

extraction = []
trait_map = {line.split('|')[0]:line.split('|')[1:] for line in TRAITS.splitlines()}
for ref in records:
    mat,style,shape,technique = trait_map[ref['id']]
    observed = notes[ref['id']][3]
    colors = [word for word in ['blanc','bleu','vert','violet','rose','orange','rouge','jaune','brun','noir','argent','doré'] if word in (observed+' '+ref['label']).lower()]
    themes = [f[0] for f in FAMILIES if int(ref['id']) in f[2]]
    extraction.append({'id':ref['id'],'label':ref['label'],'materials_reading':mat,'style_reading':style,'period_reading':period_reading(ref,style),'silhouette':shape,'technique':technique,'colors_reading':colors,'themes':themes,'observed':observed,'attribution':ref['attribution'],'material_and_style_status':'Lecture visuelle : pas une authentification','sheet':'../'+ref['group']+'/'+ref['id']+'/FICHE.md'})
assert len(extraction)==116 and all(r['themes'] for r in extraction)


def tint(c, amount):
    values = [int(c[i:i+2],16) for i in (1,3,5)]
    target = 255 if amount>0 else 0
    return '#'+''.join(f'{round(v+(target-v)*abs(amount)):02x}' for v in values)


def curve(points, smooth=True):
    out = f'M{points[0][0]:.2f} {points[0][1]:.2f}'
    if not smooth:
        return out+' '+' '.join(f'L{x:.2f} {y:.2f}' for x,y in points[1:])
    for i in range(len(points)-1):
        a = points[max(0,i-1)]; b = points[i]; c = points[i+1]; d = points[min(len(points)-1,i+2)]
        p1 = (b[0]+(c[0]-a[0])/6,b[1]+(c[1]-a[1])/6)
        p2 = (c[0]-(d[0]-b[0])/6,c[1]-(d[1]-b[1])/6)
        out += f' C{p1[0]:.2f} {p1[1]:.2f} {p2[0]:.2f} {p2[1]:.2f} {c[0]:.2f} {c[1]:.2f}'
    return out


def path(d,fill='none',stroke=None,width=1,extra=''):
    return f'<path d="{d}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="{width}"' if stroke else '')+f' {extra}/>'


def leaf(x,y,size,angle,motif,paint):
    if motif=='Ginkgo':
        d='M0 28 C-3 7-38-10-29-30 Q-14-51 0-37 Q15-51 30-30 C38-9 4 9 0 28Z'
    elif motif=='Lierre':
        d='M0 31 C-16 13-30 16-22-1 L-35-21 L-10-18 L0-43 L11-18 L36-21 L23 2 C30 18 12 15 0 31Z'
    elif motif=='Feuilles de chêne':
        d='M0 34 C-10 20-23 23-18 10 C-33 3-26-8-18-7 C-32-22-15-27-8-23 Q-8-42 0-44 Q11-37 8-22 C28-27 30-12 19-8 C35 0 23 12 18 10 C24 24 8 22 0 34Z'
    else:
        d='M0 33 C-40 7-35-26 0-45 C35-26 40 7 0 33Z'
    return f'<g transform="translate({x:.1f} {y:.1f}) rotate({angle}) scale({size:.3f})">{path(d,paint,tint(paint,-.24),.7)}{path("M0 30 Q8-3 0-35","none",tint(paint,.43),1.8)}</g>'


def blossom(x,y,size,petals,paint):
    parts = []
    for k in range(petals):
        parts.append(path('M0 4 C-17-8-14-25 0-31 C15-22 16-9 0 4Z',paint,tint(paint,-.17),.6, f'transform="rotate({k*360/petals:.1f})"'))
    return f'<g transform="translate({x:.1f} {y:.1f}) scale({size:.3f})">'+''.join(parts)+f'<circle r="5" fill="{tint(paint,-.32)}"/></g>'


def motif(c,top,height,radius,paint):
    theme, variation, kind = c['family'],c['variation'],c['motif']
    mid = top+height*.54
    rng = random.Random(c['number']*1237)
    ink = tint(paint,-.44); light = tint(paint,.50)
    out=[]
    if theme=='Feuillage':
        for i in range(3+(variation%3)):
            x=150+(i-(2+variation%3)/2)*23; y=top+height*(.37+(i%2)*.28)
            out.append(leaf(x,y,.76+(i%2)*.2,-35+i*23,kind,light))
    elif theme=='Corolles':
        for i in range(1+variation%3):
            out.append(blossom(150+(i-(variation%3)/2)*37,mid+(i%2)*37,.80+(i%2)*.19,5+(variation%3),light))
        out.append(path(f'M{150-radius*.4} {top+height*.85} Q180 {mid+40} 150 {mid}',stroke=light,width=3))
    elif theme=='Lianes':
        out.append(path(f'M{150-radius*.55} {top+height*.88} C{150+radius*.8} {mid+35} {150-radius*.9} {mid-52} {150+radius*.6} {top+height*.12}',stroke=light,width=6))
        for i in range(4): out.append(leaf(131+(i%2)*35,top+height*(.23+i*.17),.34,45 if i%2 else -48,'Lotus',light))
    elif theme=='Oiseaux':
        for i in range(2+variation%2):
            x=130+i*25; y=top+height*(.33+i*.16)
            out.append(f'<g transform="translate({x} {y:.1f}) rotate({-15+i*22})">{path("M-27 7 Q-7-20 7-8 Q18-21 32-8 Q21-4 9 6 Q-5 16-27 7Z",light,ink,.6)}{path("M2 3 Q7 24-8 32",stroke=light,width=3)}</g>')
    elif theme=='Insectes':
        wings='M0 0 C-51-47-54-7-7 5 C-37 8-35 34-2 18 M0 0 C51-47 54-7 7 5 C37 8 35 34 2 18'
        out.append(f'<g transform="translate(150 {mid:.1f}) rotate({variation*8-55})">{path(wings,light,ink,1)}<ellipse cy="8" rx="4" ry="34" fill="{ink}"/>{path("M-2-22 Q-14-32-17-35 M2-22 Q14-32 17-35",stroke=ink,width=1.5)}</g>')
    elif theme=='Bestiaire':
        if kind=='Lapins':
            out.append(f'<g transform="translate(150 {mid:.1f})"><ellipse cy="12" rx="22" ry="33" fill="{light}"/><ellipse cx="-9" cy="-29" rx="7" ry="25" fill="{light}" transform="rotate(-14)"/><ellipse cx="9" cy="-29" rx="7" ry="25" fill="{light}" transform="rotate(14)"/><circle cy="-9" r="18" fill="{light}"/><circle cx="-7" cy="-11" r="2" fill="{ink}"/><circle cx="7" cy="-11" r="2" fill="{ink}"/></g>')
        elif kind=='Chauve-souris':
            out.append(path(f'M150 {mid-15} Q126 {mid-58} 99 {mid-35} Q108 {mid-2} 130 {mid+9} L150 {mid+25} L170 {mid+9} Q192 {mid-2} 201 {mid-35} Q174 {mid-58} 150 {mid-15}Z',light,ink,1))
        else:
            out.append(f'<g transform="translate(155 {mid:.1f}) rotate({variation*11-65})">{path("M-11-20 C-22-9-19 21 0 26 C20 20 23-9 11-20 Q0-29-11-20Z",light,ink,1)}{path("M-10-12 L-28-22 L-42-10 M10-12 L28-22 L42-10 M-10 15 L-32 32 L-44 14 M10 15 L32 32 L44 14",stroke=light,width=6,extra='stroke-linecap="round"')}<circle cx="-8" cy="-22" r="5" fill="{ink}"/><circle cx="8" cy="-22" r="5" fill="{ink}"/></g>')
    elif theme=='Eau et poissons':
        for i in range(3): out.append(path(f'M{150-radius*.85} {mid+i*22} Q130 {mid+i*22-16} 160 {mid+i*22} T{150+radius*.85} {mid+i*22}',stroke=light,width=2.5))
        if kind!='Vagues': out.append(f'<g transform="translate(155 {mid-21:.1f}) rotate(-22)">{path("M-28 0 Q-3-23 23 0 Q-3 23-28 0 L-43-15 L-43 15Z",light,ink,.7)}<circle cx="12" cy="-2" r="2" fill="{ink}"/></g>')
    elif theme=='Dragons':
        out.append(path(f'M123 {mid+58} C215 {mid+37} 93 {mid-5} 172 {mid-18} C206 {mid-25} 170 {mid-48} 151 {mid-51}',stroke=light,width=13,extra='stroke-linecap="round"'))
        out.append(path(f'M146 {mid-49} L158 {mid-68} L176 {mid-62} L186 {mid-47} L166 {mid-40}Z',light,ink,1))
        out.append(path(f'M162 {mid-64} L162 {mid-79} M172 {mid-59} L185 {mid-73}',stroke=ink,width=2))
    elif theme=='Facettes':
        for i in range(7):
            x=150-radius+i*radius/3
            out.append(path(f'M{x:.1f} {top} L{x+radius*.7:.1f} {mid} L{x:.1f} {top+height} L{x-radius*.3:.1f} {mid}Z',light if i%2 else ink,extra='opacity=".16"'))
    elif theme=='Architecture':
        for i in range(4+(variation%2)):
            x=150+(i-1.5-(variation%2)*.5)*radius*.36
            out.append(path(f'M{x:.1f} {top+7} Q{150+(x-150)*.65:.1f} {mid} {x+(x-150)*.35:.1f} {top+height-5}',stroke=light,width=5))
        out.append(path(f'M{150-radius*.66} {top+height*.26} Q150 {top-18} {150+radius*.66} {top+height*.26}',stroke=light,width=5))
    elif theme=='Empilements':
        for i in range(3+variation%3):
            y=top+height*(.22+i*.13); dy=variation%2*3
            out.append(path(f'M{150-radius} {y} L{150+radius} {y-dy} L{150+radius} {y+11-dy} L{150-radius} {y+11}Z',light if i%2 else ink,extra='opacity=".55"'))
    elif theme=='Figures':
        out.append(f'<g transform="translate(150 {mid:.1f})"><ellipse rx="30" ry="52" fill="{light}" opacity=".75"/>{path("M-19-13 Q-12-20-5-12 M7-13 Q14-19 20-12 M3-12 L-1 12 L8 15 M-8 28 Q2 34 12 27",stroke=ink,width=2.2)}{path("M-35 56 Q-18 38-27-5 Q-42-36-8-53 M32 58 Q45 14 24-20",stroke=light,width=5)}</g>')
    elif theme=='Paysages':
        out.append(path(f'M50 {mid+39} Q119 {mid-4} 171 {mid+23} T250 {mid+15} L250 390 L50 390Z',ink,extra='opacity=".38"'))
        for i in range(5):
            x=108+i*21; y=mid-10+(i%2)*21
            out.append(path(f'M{x} {mid+55} L{x} {y-31} M{x} {y+4} l-13-17 M{x} {y-1} l17-18',stroke=ink,width=2.1))
    elif theme=='Cloisonné':
        for i in range(7):
            x=150+math.cos(i*2.3)*radius*.6; y=mid+math.sin(i*2.3)*height*.23
            out.append(blossom(x,y,.35+(i%2)*.14,5,tint(paint,.55)))
        out.append(path(f'M{150-radius} {top+height*.18} Q150 {top+height*.25} {150+radius} {top+height*.18} M{150-radius} {top+height*.85} Q150 {top+height*.91} {150+radius} {top+height*.85}',stroke='#c3af70',width=3))
    elif theme=='Cristallisations':
        for i in range(18):
            x=rng.uniform(150-radius*.9,150+radius*.9); y=rng.uniform(top+15,top+height-15); size=rng.uniform(5,17)
            for k in range(6):
                a=k*math.pi/3
                out.append(path(f'M{x:.2f} {y:.2f} l{math.cos(a)*size:.2f} {math.sin(a)*size:.2f}',stroke=light,width=1.5,extra='opacity=".52"'))
    elif theme=='Textures de métal':
        for i in range(42):
            x=rng.uniform(150-radius*.95,150+radius*.95); y=rng.uniform(top+12,top+height-10)
            out.append(f'<ellipse cx="{x:.2f}" cy="{y:.2f}" rx="{rng.uniform(2,5):.2f}" ry="{rng.uniform(2,4):.2f}" fill="{ink}" opacity=".15"/><ellipse cx="{x-1:.2f}" cy="{y-1:.2f}" rx="2" ry="1.3" fill="{light}" opacity=".4"/>')
    elif theme=='Ajours':
        for i in range(7):
            x=150+math.cos(i*2.3)*radius*.64; y=top+height*(.2+i*.09)
            out.append(path(f'M{x-13:.2f} {y-18:.2f} Q{x-23:.2f} {y} {x-8:.2f} {y+20:.2f} Q{x+19:.2f} {y+8:.2f} {x+13:.2f} {y-14:.2f}Z', '#f4f1e8', ink,1.4))
    elif theme=='Inclusions':
        for i in range(9):
            x=rng.uniform(150-radius*.7,150+radius*.7); y=rng.uniform(top+20,top+height-27); size=rng.uniform(4,14)
            out.append(f'<ellipse cx="{x:.2f}" cy="{y:.2f}" rx="{size:.2f}" ry="{size*1.6:.2f}" fill="{light}" fill-opacity=".12" stroke="{light}" stroke-width="1.5"/>')
    elif theme=='Torsions':
        for i in range(3):
            out.append(path(f'M{117+i*25} {top-3} C{226-i*12} {mid-57} {77+i*15} {mid+50} {161+i*13} {top+height+3}',stroke=light if i%2 else ink,width=14-i*2,extra='opacity=".58"'))
    else:
        out.append(path(f'M{150-radius*.8} {top+height*.17} Q150 {top+height*.23} {150+radius*.8} {top+height*.17}',stroke=light,width=2.5))
    return '\n'.join(out)


def draw(c):
    variation=c['variation']; f=c['family_index']; shape=SHAPES[c['shape_index']]
    name,profile,height,radius=shape
    height *= .91+(f%5)*.032
    radius *= .88+((f*3+variation)%7)*.035
    top=350-height
    left=[];right=[]
    for t,r in profile:
        lean=(math.sin(t*math.pi)*10+8*(1-t)) if name in ('Asymétrique','Arche') else 0
        y=top+t*height
        left.append((150+lean-r*radius*(.90 if name=='Asymétrique' else 1),y))
        right.append((150+lean+r*radius,y))
    smooth=name not in ('Polyèdre','Prisme','Étages')
    d=curve(left,smooth)+curve(list(reversed(right)),smooth).replace('M','L',1)+'Z'
    color=c['color']; dark=tint(color,-.44); light=tint(color,.55); finish=c['finish']
    if finish=='metal':
        stops=[(0,dark),(15,tint(color,-.17)),(35,light),(48,color),(64,dark),(84,tint(color,.15)),(100,tint(color,-.30))]
    else:
        stops=[(0,tint(color,-.2)),(28,tint(color,.29)),(46,tint(color,.13)),(77,color),(100,tint(color,-.26))]
    opacity='.64' if finish=='glass' else '1'
    defs=f'<defs><linearGradient id="surface" x2="1" y2=".12">'+''.join(f'<stop offset="{o}%" stop-color="{col}"/>' for o,col in stops)+'</linearGradient><linearGradient id="shine" x2="1"><stop stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'+f'<clipPath id="vessel">{path(d,"#fff")}</clipPath></defs>'
    art=[]
    if c['foot']=='Trois pieds':
        for x in (122,150,178): art.append(path(f'M{x-6} 339 L{x-9} 367 Q{x} 372 {x+9} 367 L{x+6} 339Z','url(#surface)',dark,.7))
    elif c['foot']=='Socle carré': art.append(path('M115 345 L183 345 L190 365 L109 365Z','url(#surface)',dark,.8))
    elif c['foot']=='Pied court': art.append(path('M139 339 L136 356 L122 364 Q150 371 178 364 L164 356 L161 339Z','url(#surface)',dark,.7))
    elif c['foot']=='Disque': art.append('<ellipse cx="150" cy="355" rx="38" ry="9" fill="url(#surface)"/>')
    else: art.append('<ellipse cx="150" cy="350" rx="30" ry="6.5" fill="url(#surface)"/>')
    art.append(path(d,'url(#surface)',dark,1.1,f'fill-opacity="{opacity}"'))
    art.append('<g clip-path="url(#vessel)">')
    if finish=='glass':
        art.append(path(f'M{150-radius*.35} {top+30} Q{150-radius*.53} {top+height*.55} 143 {top+height*.9} Q{150+radius*.50} {top+height*.80} {150+radius*.35} {top+30}Z',color,extra='opacity=".25"'))
    art.append(motif(c,top,height,radius,color))
    art.append(path(f'M{150-radius*.51} {top+height*.21} Q{150-radius*.72} {top+height*.58} {150-radius*.39} {top+height*.86}',stroke=light,width=2.4,extra='opacity=".52" stroke-linecap="round"'))
    if name=='Arche': art.append(path(f'M136 {mid if (mid:=top+height*.58) else 0} Q150 {mid-47} 164 {mid} L166 {mid+38} Q150 {mid+23} 134 {mid+38}Z','#f4f1e8',dark,.8))
    art.append('</g>')
    mouth=profile[0][1]*radius
    if c['lip']=='Oblique':
        art.append(f'<ellipse cx="150" cy="{top}" rx="{mouth}" ry="{max(3,mouth*.19)}" transform="rotate(-12 150 {top})" fill="{dark}" stroke="{light}" stroke-width="2.1"/>')
    else:
        art.append(f'<ellipse cx="150" cy="{top}" rx="{mouth}" ry="{max(3,mouth*.16)}" fill="{dark}" stroke="{light}" stroke-width="{1 if c["lip"]=="Fin" else 2.3}"/>')
    if c['lip']=='Lobé':
        for k in range(5):
            x=150+(k-2)*mouth*.38
            art.append(path(f'M{x-6} {top+1} Q{x} {top-7-(k%2)*5} {x+6} {top+1}',stroke=light,width=3,extra='stroke-linecap="round"'))
    if name=='Amphore' or (f==2 and variation%3==0):
        for side in (-1,1):
            x=150+side*radius*.53
            art.append(path(f'M{x} {top+height*.12} C{x+side*radius*.8} {top+height*.12} {x+side*radius*.78} {top+height*.47} {150+side*radius*.81} {top+height*.48}',stroke=dark,width=7,extra='stroke-linecap="round"'))
            art.append(path(f'M{x} {top+height*.12} C{x+side*radius*.8} {top+height*.12} {x+side*radius*.78} {top+height*.47} {150+side*radius*.81} {top+height*.48}',stroke=light,width=3))
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400" role="img" aria-labelledby="title"><title id="title">{c["id"]} — {c["name"]}</title>{defs}'+''.join(art)+'</svg>'


concepts=[]
for v in range(20):
    for f, family in enumerate(FAMILIES):
        title,motifs,refids,mats,styles=family
        number=len(concepts)+1; ident=f'C{number:03d}'; si=(v*7+f*3)%20
        mi=mats[(v+f)%len(mats)]; material,finish,colors=MATERIALS[mi]
        motif_name=motifs[(v+f//3)%len(motifs)]
        foot=FEET[(v*2+f)%len(FEET)]; lip=LIPS[(v+f*2)%len(LIPS)]
        c={'id':ident,'number':number,'name':motif_name+' · '+SHAPES[si][0],'family':title,'family_index':f,'variation':v,'shape':SHAPES[si][0],'shape_index':si,'motif':motif_name,'material':material,'finish':finish,'color':colors[(v//4+f)%len(colors)],'style':styles[(v//3+f)%len(styles)],'foot':foot,'lip':lip,'references':[f'{r:03d}' for r in refids],'file':f'svg/{ident}.svg','brief':f'{motif_name} sur une forme {SHAPES[si][0].lower()}, {material.lower()}, ouverture {lip.lower()}, {foot.lower()}.','stage':'Ébauche de concept, détail à développer après sélection'}
        c['period']=PERIODS.get(c['style'],'Répertoire moderne / contemporain' if c['style']!='Minimalisme' else 'Répertoire minimal contemporain')
        (ROOT / c['file']).write_text(draw(c),encoding='utf-8')
        concepts.append(c)

assert len(concepts)==400 and len({(c['family'],c['shape']) for c in concepts})==400
(ROOT / 'extraction-116.json').write_text(json.dumps(extraction,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT / 'concepts.json').write_text(json.dumps(concepts,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT / 'catalogue.js').write_text('window.VASE_CONCEPTS = '+json.dumps(concepts,ensure_ascii=False)+';\n',encoding='utf-8')
(ROOT / 'references.js').write_text('window.VASE_REFERENCES = '+json.dumps(extraction,ensure_ascii=False)+';\n',encoding='utf-8')
(ROOT / 'vocabulaire.json').write_text(json.dumps({'families':[f[0] for f in FAMILIES],'materials':[m[0] for m in MATERIALS],'profiles':[s[0] for s in SHAPES],'feet':FEET,'lips':LIPS,'styles':sorted({c['style'] for c in concepts})},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
rows='\n'.join(f'| {r["id"]} | {r["materials_reading"]} | {r["style_reading"]} | {r["period_reading"]} | {r["silhouette"]} | {r["technique"]} |' for r in extraction)
(ROOT / 'EXTRACTION.md').write_text('''# Vocabulaire visuel des 116 références

Lecture des photographies et des notes individuelles. Les matériaux comportant « probable », « ou » ou une alternative restent des hypothèses. Les styles sont des directions visuelles, pas une datation authentifiée. Les attributions antérieures restent dans les fiches de référence.

La génération croise 20 familles de concepts et 20 profils, avec 16 matières, 5 ouvertures et 5 types de pied. Chaque dessin est une ébauche autonome ; aucune photographie, signature ou marque n'est incorporée. Ces croisements ne constituent pas une garantie juridique.

| Référence | Matière lue | Influence visuelle | Époque / piste | Profil | Technique / caractéristique |
|---|---|---|---|---|---|
'''+rows+'\n',encoding='utf-8')
print(json.dumps({'references':len(extraction),'concepts':len(concepts),'families':len(FAMILIES),'profiles':len(SHAPES),'materials':dict(Counter(c['material'] for c in concepts))},ensure_ascii=False))
