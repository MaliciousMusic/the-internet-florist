# Lot 25 « lianes et matières » : rapport

Fichiers : `s25a.js` (5 espèces), `c5.js` (copie moteur modifiée, diff plus bas), `sheets/` (vues, coloris, tailles, cartes, bouquets).

## Espèces

### Liane de jasmin (`jasminum-liane-jasmin`, *Jasminum polyanthum*, *J. officinale*)
- **Botanique.** Tige volubile souple qui retombe et s'enroule un peu en profondeur. Feuilles opposées décussées, pennées, à 5 ou 7 folioles lancéolées ; la foliole terminale est plus longue. Panicules axillaires et terminales : boutons roses en massue, tube rosé, étoile blanche à 5 lobes de 2 cm. Le revers des lobes est rosé.
- **Coloris** (`CWS`) : Polyanthum fleuri, Polyanthum en boutons roses, Officinale blanc pur, Feuillage seul, Officinale Fiona Sunrise (doré). La couleur d'un modèle teinte le feuillage ; les fleurs suivent le Polyanthum fleuri.
- **Tailles** : brins de 60, 80, 100 et 120 cm.
- **Stades** : en bouton, la panicule ne porte que des boutons ; la part de fleurs ouvertes croît avec le stade.
- **Coût.** Folioles, fleurs, boutons et pédicelles sont regroupés par plan (derrière ou devant la tige) et par niveau de lumière. Un brin tient en une trentaine de tracés. Mesure perf2 sur les 14 modèles concernés : **917 → 68 éléments par drapé** (3 brins), soit 13 fois moins.
- **La lèvre.** Le composeur transmet le contexte du drapé (`DRAPEX` : origine, côté, lèvre, embouchure, sol). Le brin sort de l'embouchure, passe en crête au-dessus de la lèvre puis retombe devant le vase. Sur un vase posé, sa longueur est coupée à la hauteur du sol : il ne passe jamais sous la lèvre ni sous le vase.

### Arbre à perruques (`cotinus-coggygria-arbre-a-perruques`)
- **Botanique.** Rameau aux feuilles alternes (spirale 2/5), rondes à obovales, entières, à fines nervures pennées. Longs pétioles (de 45 à 70 % du limbe). Les feuilles sont plus serrées et plus petites vers la pointe, avec un bourgeon de deux jeunes feuilles et souvent un rameau latéral ; la base de la tige est effeuillée.
- **Rendu.** Chaque feuille est en 3D : deux demi-limbes pliés sur la nervure, éclairés chacun par sa normale, face ou revers (plus pâle) selon l'angle. Rien n'est plat de profil.
- **Coloris** : Pourpre Royal Purple, Pourpre noir Velvet Cloak, Rouge vin Grace, Vert bleuté, Doré Golden Spirit, Feu d'automne.
- **Tailles** : tiges de 40, 50, 60 et 70 cm (sur la planche, `cm` ≥ 20 donne la longueur de tige, sinon la taille de la feuille).

### Fustet en plumes (`fustet-plumes`, panicules de *Cotinus*)
- **Botanique.** Grande panicule lâche, presque toute stérile : ses pédicelles allongés portent de longs poils étalés, qui font la « fumée ». Quelques feuilles rondes sous la panicule, pourpres ou vertes selon le cultivar.
- **Rendu.** Une ossature de rameaux et de ramilles, et des milliers de poils fins et ondulés, regroupés en 8 tracés (derrière ou devant × 4 niveaux de lumière) avec un voile léger. Ni flou ni halo.
- **Stades** : jeune panicule compacte vert crème avec de petites fleurs, puis mi-plumeuse, puis plume pleine.
- **Coloris** : Rose fumé, Vieux rose, Pourpre Royal Purple, Beige rosé, Vert tendre.
- **Tailles** : panicules de 15, 20 et 25 cm. Dans un bouquet, la taille de la panicule se déduit du rayon fixé par le composeur (`from`).
- **Remplace** l'ancien `xSmoke`, qui reste en place pour les autres usages.

### Ruban de soie mousseline (`ruban-soie-mousseline`, accessoire)
- **Rendu.** Bande 3D (axe et direction de la largeur) découpée là où la face visible change : on voit la face, la tranche, puis le revers (un peu plus terne). Le remplissage suit la lumière, avec une transparence légère (opacité 0,82 à 0,84). Les bords bruts sont froissés et effilochés en fils fins.
- **Dans un vase.** Le ruban monte vrillé serré autour de sa tige, comme un cordon, s'ouvre en sortant des fleurs puis retombe vers l'extérieur. Son bout reste au-dessus de l'embouchure.
- **Dans un bouquet noué ou en papier.** Le ruban devient le lien : un nœud à deux boucles qui montrent la face et le revers, un nœud central, une bande autour des tiges et deux pans coupés en biais. Il remplace le nœud par défaut.
- **Planche** : bouton = ruban libre, mi-ouvert = ruban bouclé, ouvert = nœud.
- **Coloris** : ivoire, blush, vieux rose, rose tendre, corail, sable, sauge, lilas, prune, noir.
- **Tailles** : largeurs de 2,5, 4 et 5 cm (2 à 2,6 cm dans un vase, 3,8 cm pour le nœud).

### Fil d'aluminium décoratif (`fil-aluminium-decoratif`, accessoire)
- **Rendu.** Fil plein de 2 mm, anodisé, formé de passages ondulés, de ressorts serrés autour de l'axe, de boucles et d'une spirale plate au bout. Trois enchaînements tirés au hasard.
- **Profondeur.** Le tube est dessiné par plans de profondeur, avec hystérésis : il passe devant et derrière lui-même (ressorts). Trois traits par plan : ombre, corps et reflet net décalé vers la lumière.
- **Coloris** : argent, or, cuivre, rose, rouge, noir.
- **Tailles** : 40, 50 et 60 cm.

## QA et perf
- QA composée avec `inc` = les 5 espèces, graines 5, 11 et 23 × 20 bouquets : **0 F, 0 U, 0 kink**.
- QA des modèles 6, 7, 8, 11, 14, 15, 17, 33, 38, 39, 49, 53, 60 et 79 : **0 F, 0 U, 0 kink**.
- Perf (76 modèles, même machine) :

  | | Avant | Après |
  |---|---|---|
  | Temps moyen | 278 ms | 225 ms |
  | Éléments moyens | 10 150 | 10 014 |

  La machine cloud est plus lente que la référence de 142 ms.
- Éléments par tige dans un bouquet (perf2) :

  | Espèce | Avant | Après |
  |---|---|---|
  | Jasmin (par drapé de 3 brins) | 917 | 68 |
  | Cotinus | 129 | 104 |
  | Fustet | 82 | 26 |
  | Fil | 4 | 27 |
  | Ruban | 10 | 0 (sur les modèles, il devient le nœud, non compté par élément) |

## Diff moteur (`c5.js`, minimal et rétro-compatible)
- `let DRAPEX=null` : le contexte d'un drapé, posé autour des `drawRec` du drapé (`try/finally`). Les autres drapés l'ignorent.
- Bouquet tenu (main ou papier) : une tige `self` dont `GHI[sid].tie` existe n'est pas dessinée comme ligne ; elle fournit le nœud à la place de `bow()`. Aucune autre espèce n'a `tie`.
- Tige basse d'une grappe (`from`) : elle prend la largeur et les couleurs `{bw,bc}` renvoyées par l'espèce, sinon le vert par défaut. Aujourd'hui, seuls le fustet et le cotinus renvoient `bc` en mode grappe : les épis du lot 8 renvoient `bw`/`bc` mais ne sont jamais des grappes.

```diff
2a3,4
> /* where the drape being drawn hangs (its origin, side, the vessel's lip and floor), for the species that route their strands over the lip; and the ribbon that ties a held bouquet */
> let DRAPEX=null;
60c62
<   let mk=null;const mark=i=>{if(mk)for(const k in L){const ch=L[k].children;for(let j=mk[k];j<ch.length;j++)ch[j].setAttribute('data-o',mk.i)}mk={i};for(const k in L)mk[k]=L[k].children.length};
---
>   let tieBy=null,mk=null;const mark=i=>{if(mk)for(const k in L){const ch=L[k].children;for(let j=mk[k];j<ch.length;j++)ch[j].setAttribute('data-o',mk.i)}mk={i};for(const k in L)mk[k]=L[k].children.length};
64c66
<       [[1,0,0],[.8,-20,0],[.62,24,0]].forEach(([k,sw,dx],j)=>{const h=G(g,{transform:`translate(0,${j*1.5})`});drawRec(h,t+j*90,dr,{col:o.it.p.col,len:o.len*k,sway:o.sway+sw*(o.side||1)})});
---
>       DRAPEX={x:o.x,y:o.y,side:o.side||1,held,top:vTop,mw:mwV,mcx,FL};try{[[1,0,0],[.8,-20,0],[.62,24,0]].forEach(([k,sw,dx],j)=>{const h=G(g,{transform:`translate(0,${j*1.5})`});drawRec(h,t+j*90,dr,{col:o.it.p.col,len:o.len*k,sway:o.sway+sw*(o.side||1)})})}finally{DRAPEX=null}
68a71,72
>     /* a ribbon in a held bouquet ties it: drawn as the bow at the tie */
>     if(o.kind==='self'&&held&&(GHI[o.it.p.sid]||{}).tie){tieBy=tieBy||o;continue}
79c83
<       if(o.spine&&o.from){const st=stem3(L.stems,bseg(o.spine.map(p=>[p[0]+o.x,p[1]+o.y]),0,Math.min(1,o.from+.03)),3.4,2.4,SC,12);growUp(st,o.x,o.y,Math.max(0,t-520),520)}
---
>       if(o.spine&&o.from){const sb=o.sb&&o.sb.c?o.sb:null,st=stem3(L.stems,bseg(o.spine.map(p=>[p[0]+o.x,p[1]+o.y]),0,Math.min(1,o.from+.03)),sb?sb.w:3.4,sb?sb.w*.72:2.4,sb?sb.c:SC,12);growUp(st,o.x,o.y,Math.max(0,t-520),520)}
109,110c113,115
<   if(v.kind==='wrap'){wrapFront(L.front,BP,pc||vc||v.paper,c);growUp(bow(L.front,BP[0],BP[1]+30,v.rib,.6),BP[0],BP[1]+30,t0+420,420)}
<   if(v.kind==='hand')growUp(bow(L.front,BP[0],BP[1]+16,vc||v.rib,.8),BP[0],BP[1]+16,t0+420,420);
---
>   const tie=(y,c0,lg)=>tieBy?GHI[tieBy.it.p.sid].tie(L.front,BP[0],y,tieBy.it.p.col):bow(L.front,BP[0],y,c0,lg);
>   if(v.kind==='wrap'){wrapFront(L.front,BP,pc||vc||v.paper,c);growUp(tie(BP[1]+30,v.rib,.6),BP[0],BP[1]+30,t0+420,420)}
>   if(v.kind==='hand')growUp(tie(BP[1]+16,vc||v.rib,.8),BP[0],BP[1]+16,t0+420,420);
```

## Doutes
- Le composeur peut mettre jusqu'à 5 rubans « ligne » dans un vase : c'est beaucoup pour un accessoire. Je ne l'ai pas limité, car cela demanderait de toucher c4.
- Sur les cartes du Composer, la tige verte dessinée par `bunchArt` rejoint les rameaux pourpres du cotinus et du fustet.
- Le nœud n'est pas étiqueté `data-o` (comme l'ancien `bow`) : perf2 compte donc 0 pour le ruban sur les modèles noués.
