# Lot 108 « accessoires » : rapport

Branche `serre/108-accessoires`. Fichier du lot : `s108a.js`, préfixe `l108`/`L108_`. Copie moteur : `c5.js`.
Aucune des trois espèces n'avait d'ancienne version `GH` : elles passaient par `gAccessory` (e5.js) en 2D, que `GH` remplace sous le même sid.

## Plume d'autruche teinte (`plume-autruche-teinte`)
- **Matière.** Plume d'aile d'autruche. Le rachis est souple, effilé et arqué. Les barbes sont libres (sans crochets), longues, ondulées et retombantes, et couvertes de barbules duveteuses. Les barbes du bas sont plus courtes et la pointe est arrondie.
- **Dessin.**
  - Le rachis est un tube 3D (`stem3`) le long de l'axe `spAxis`, sur l'épine du Composer ou dressé dans le repère de la vue.
  - Il porte 2 × 50 à 2 × 78 barbes 3D : écartées vers la pointe, retombantes, recourbées en avant ou en arrière, et ondulées.
  - Elles sont regroupées en 2 couches (derrière ou devant le rachis) × 4 lumières.
  - Chaque barbe est faite d'une bande de duvet, d'un trait de barbe (1,15) et d'un reflet net.
  - Les barbules (franges fines) ne sont dessinées que sur les planches (DET 2).
  - En bouquet, aucune barbe ne descend sous le col : elle retombe moins, sinon elle est raccourcie.
- **Stades.** Bouton : plume lissée, barbes serrées contre le rachis. Mi-ouvert : demi-gonflée. Ouvert : pleinement gonflée.
- **Coloris (12).** Blanc naturel, ivoire, naturel drab, noir, rose poudré, lavande, fuchsia, rouge, corail, bleu roi, turquoise, vert sauge.
- **Tailles (cm).** 20, 35, 45, 55 (plumes de 15–20 à 55–60 cm).

## Chaînes de strass et de perles (`chaines-strass-perles`)
- **Matière.**
  - Un fil de perles nacrées de 6 mm et une chaîne de strass (pierres serties dans des chatons carrés de 4 mm).
  - Les deux s'enroulent en spirale autour d'une tige de fil argenté, s'en échappent en boucles retombantes, et le fil de perles finit par une pampille terminée par une grosse perle.
- **Dessin.**
  - La tige est faite par `wireDraw` du lot 25.
  - Les perles sont posées à pas constant le long des courbes 3D, pour qu'elles se touchent.
  - Chaque perle est dessinée par 4 disques : ombre, corps, lumière et point de lumière blanc net.
  - Chaque chaton est un carré de métal orienté le long de la chaîne, avec sa pierre, une facette éclairée (irisée pour l'aurore boréale) et une étincelle à 8 branches sur une pierre sur trois.
  - Le tout est regroupé par bandes de profondeur avec la tige, si bien que les fils passent derrière et devant elle.
  - Les boucles et la pampille ne descendent jamais sous le col.
- **Stades.** Bouton : enroulé serré. Mi-ouvert : une boucle par fil. Ouvert : deux boucles et la pampille.
- **Coloris (9).** Cristal et perles blanches ; strass argent et perles gris perle ; aurore boréale et lilas ; perles ivoire ; perles champagne avec monture or ; péridot et perles crème ; rose poudré avec or rose ; saphir ; jais.
- **Tailles (cm).** 30, 45, 45, 60.

## Papier d'emballage (`papier-emballage-floral`)
- **Matière.** Quatre papiers :
  - kraft : raide, aux plis vifs ;
  - crépon : froncé de fines stries, au bord étiré en volant ;
  - papier de soie : translucide, froissé, en trois feuilles décalées au bord déchiré ;
  - papier coréen : mat, plissé en éventail, doublé d'une teinte claire.
- **Dessin.**
  - Chaque feuille est un cône plissé en 3D (`l108Sheets`) fait de facettes planes, creux et crêtes en alternance.
  - Elle est rassemblée sous le lien, pincée au lien, puis s'évase.
  - Chaque facette est éclairée par sa normale, et l'intérieur du cône est dans son ombre.
  - Le bord accroche la lumière (trait net). Plis, stries ou froissures sont dessinés selon le papier.
- **Usage dans le Composer.**
  - **Bouquet tenu** (`noue` ou `papier`) : le papier choisi devient l'emballage. Derrière les fleurs, on voit l'intérieur des feuilles hautes ; devant, la face extérieure des feuilles basses, nouées à BP+30. Il remplace la collerette du vase `papier` et ne se dessine pas comme une tige.
  - **Vase** : un éventail de papier plissé, rassemblé dans le col, se dresse derrière les fleurs (rôle « ligne »).
  - **Planche et carte** : l'emballage complet autour de tiges coupées, avec son lien de raphia. Toutes les facettes y sont triées en profondeur, pour tous les angles.
- **Stades.** Bouton : manchon presque fermé. Mi-ouvert : entrouvert. Ouvert : évasé.
- **Coloris (12).**
  - Kraft : naturel, blond, blanc.
  - Coréen : blanc menthe, crème, noir, sauge.
  - Crépon : rose poudré, bordeaux.
  - Soie : blanc, rose, lilas.
- **Tailles (cm, côté de feuille).** 50, 60, 60, 70.

## QA
- **Composés avec `inc=` les 3 sids, graines 5, 7 et 11 × 20** : 60 bouquets, **0 F, 0 U, 0 kink**.
  - Les pièces flottantes d'abord trouvées (grosse perle de pampille décollée) ont été corrigées : la perle est maintenant posée contre la dernière perle du fil.
  - Contrôle ciblé sur les bouquets tenus (`vases=noue,papier`, 8 bouquets) : 0 F, 0 U.
- **Modèles.**
  - Modèles qui utilisent ces espèces : 24 (plume) et 39 (chaînes), graines 7, 3 et 11. Résultat : 0 F, 0 U, 0 kink.
  - Rétro-compatibilité des emballages : modèles 8, 14, 15 et 55 (`papier`) et 1, 5, 11 et 38 (`noue`, dont des modèles avec ruban). Résultat : 0 partout. Sans papier parmi les éléments, le code suit exactement l'ancien chemin.
- **Perf** (`perf=1`, 76 modèles, même machine) : 210 ms et 8 295 éléments par bouquet, contre 207 ms et 8 295 éléments pour le dépôt sans le lot. Les éléments sont identiques ; l'écart de temps reste dans le bruit de la machine, plus lente que la référence de 142 ms.
  - Une plume pèse environ 20 éléments au détail de l'appli.
  - Une chaîne pèse environ 9 tracés par bande de profondeur.
  - Un emballage compte 1 tracé par facette, plus 2 par feuille.

## Diff moteur (`c5.js`, rétro-compatible)
```diff
--- ../../../demo/src/c5.js	2026-10-04 01:28:23.005294539 +0000
+++ c5.js	2026-10-04 01:35:30.132233258 +0000
@@ -36,7 +36,9 @@
   const pl=model?(model.plinth==='none'?null:model.plinth||v.pl):v.pl;
   /* the cut stems under the tie (or in the glass) rise first, from their cut ends */
   let stShow=22;
-  if(v.kind==='hand'||v.kind==='wrap'){if(v.kind==='wrap')wrapBack(L.back,BP,pc||vc||v.paper,c)}
+  /* a paper among the elements of a held bouquet wraps it (its own sheets in place of the vessel's paper) */
+  const held0=v.kind==='hand'||v.kind==='wrap',wrapBy=held0?list.find(o=>o.kind==='self'&&(GHI[o.it.p.sid]||{}).wrap)||null:null,wrapG=wrapBy&&GHI[wrapBy.it.p.sid].wrap;
+  if(v.kind==='hand'||v.kind==='wrap'){if(wrapG)wrapG.back(L.back,BP,wrapBy.it.p.col,c);else if(v.kind==='wrap')wrapBack(L.back,BP,pc||vc||v.paper,c)}
   else{const sg=stage(L.plinth,v);stShow=sg.show;vessel(L.vback,vid,t0,{noPlinth:1,part:'back',shClip:sg.top});if(v.mat==='glass'||v.kind==='kenzan')growUp(stemsBelow(L.stems,12,vid),BP[0],FL-6,t0,560);vessel(L.vase,vid,t0,{noPlinth:1,part:'front'})}
   const SC=['#24401c','#3c6229','#5f8a3e','#a9c97a'],held=v.kind==='hand'||v.kind==='wrap',vTop=held?BP[1]:FL-vMh(v),mwV=vMouth(v)||26,mcx=VX+vMx(v);
   /* below the tie of a held bouquet every stem goes on straight in its own direction (the stems cross at the binding point and fan out below it) */
@@ -70,6 +72,7 @@
     const sp=o.it.sp,rec=o.it.p.rec,cust=rec.a==='custom',c0=cmOf(o.it.p),col=o.it.p.col;
     /* a ribbon in a held bouquet ties it: drawn as the bow at the tie */
     if(o.kind==='self'&&held&&(GHI[o.it.p.sid]||{}).tie){tieBy=tieBy||o;continue}
+    if(o===wrapBy)continue;
     if(o.kind==='self'){const clu=!(o.role==='line'&&!o.short||o.role==='foliage');let wrap=null;
       /* a bent stem: the element follows its spine from the mouth; the lower part of a cluster's stem joins the other stems */
       const draw=()=>{wrap=clu?cast(o.front?L.front:L.mass,o.rr||20):null;const g=G(wrap||L.back);
@@ -111,8 +114,9 @@
     if(st&&st.P&&STEML[o.it.p.sid]){let lim=held?BP[1]:FL;if(!held)for(let i=0;i<=6;i++)lim=Math.min(lim,vSilTop(v,st.P[0][0]+(st.P[3][0]-st.P[0][0])*i/6));stemLeaves(L.stems,st.P,o.it.p.sid,lim-6,rr,t)}}
   mark(-1);mk=null;
   const tie=(y,c0,lg)=>tieBy?GHI[tieBy.it.p.sid].tie(L.front,BP[0],y,tieBy.it.p.col):bow(L.front,BP[0],y,c0,lg);
-  if(v.kind==='wrap'){wrapFront(L.front,BP,pc||vc||v.paper,c);growUp(tie(BP[1]+30,v.rib,.6),BP[0],BP[1]+30,t0+420,420)}
-  if(v.kind==='hand')growUp(tie(BP[1]+16,vc||v.rib,.8),BP[0],BP[1]+16,t0+420,420);
+  if(wrapG){wrapG.front(L.front,BP,wrapBy.it.p.col,c);growUp(tie(BP[1]+30,vc||v.rib,.6),BP[0],BP[1]+30,t0+420,420)}
+  else if(v.kind==='wrap'){wrapFront(L.front,BP,pc||vc||v.paper,c);growUp(tie(BP[1]+30,v.rib,.6),BP[0],BP[1]+30,t0+420,420)}
+  else if(v.kind==='hand')growUp(tie(BP[1]+16,vc||v.rib,.8),BP[0],BP[1]+16,t0+420,420);
   /* frame on the real silhouette */
   let x0=BP[0]-120,x1=BP[0]+120,y0=BP[1]-c.H,y1=v.kind==='hand'||v.kind==='wrap'?BP[1]+170:FL+stShow;
   for(const o of c.out){if(o.kind==='head'||o.kind==='leaf'||o.kind==='garnish'){const r=o.kind==='leaf'?110*o.scale:o.kind==='garnish'?24*o.scale:(o.rr||40);x0=Math.min(x0,o.x-r);x1=Math.max(x1,o.x+r);y0=Math.min(y0,o.y-r)}
```
Le papier déclare `GHI[sid].wrap = {back, front}`, sur le modèle du `GHI[sid].tie` du ruban. Les autres espèces et les modèles sans papier sont inchangés.

## Doutes
- Dans un vase, le papier coréen se pose surtout en éventail derrière les fleurs. Le dessin reste sobre (au plus 26 cm de haut), mais un fleuriste n'emballe pas un bouquet en vase. On pourrait aussi l'exclure des vases dans c4.js.
- Le papier de soie, translucide, voile le bas des fleurs devant lui (comme un vrai papier de soie). Le devant reste à la hauteur de `wrapFront`.
- Le sélecteur « Couleur du papier » (PAPERS) du vase `papier` reste inchangé. Si un papier est choisi comme élément, c'est son coloris qui l'emporte.
- La plume en bouquet n'a pas de barbules, pour rester au-dessus de 1,05 unité de trait : son duvet est rendu par la bande large des barbes.
