const BQ=[
 ['12 variétés · coupe',['tulipe-rouge','dahlia-cafe','dahlia-peche','anthurium-rose','phalaenopsis-magenta','cymbidium-cuivre','scabieuse-noire','rose-blush','renoncule-saumon','oeillet-poudre','pois-rose','amarante-corail'],'anniv','coupe-blanche'],
 ["Je t'aime · boule",['anthurium-bordeaux','rose-bordeaux','calla-noir','amarante-bordeaux','oeillet-bordeaux','scabieuse-noire','phalaenopsis-prune','dahlia-noir'],'amour','boule-sapin'],
 ['Merci · verre',['lys-casablanca','phalaenopsis-blanc','rose-ivoire','renoncule-blanche','delphinium-blanc','calla-ivoire'],'merci','verre'],
 ['Bravo · noué',['gloriosa','anthurium-rouge','renoncule-rouge','lys-tigre','renoncule-orange','allium-boucle','nerine-corail'],'bravo','noue'],
 ['Courage · calice',['rose-blush','dahlia-cafe','oeillet-poudre','pois-rose','renoncule-rose','anthurium-rose'],'courage','calice'],
 ['Juste · kenzan',['phalaenopsis-magenta','chrysantheme-mauve','allium-violet','scabieuse-lavande','pois-lavande','delphinium-bleu','hortensia-bleu'],'juste','kenzan']];
window.LAB=BQ.map(([n,ids,occ,vid],i)=>[n,'0 0 100 100',s=>{const c=buildBq(s,ids,11+i*7,vid,0,occ);s.closest('.c').querySelector('b').textContent=n+' · '+c.tk+' · '+s.dataset.n+' tiges'}]);
