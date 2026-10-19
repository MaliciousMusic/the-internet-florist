# calib.py <rounds> [cw...]: the §15 point-7 loop for the peony. Each round, for each colourway: guards 0 and 2 rendered alone (&solo=g0/g2,
# view 0, D 700, seed 7), their frames by fleur/repere.py, the photo's two guards paired with them (apparence.py paire -> <cw>-paire-g1/g2),
# the heart paired on the whole head (fixed frame, as before); calibre.py corrects the guard grid (g1+g2) and the heart grid (coeur), put
# back in app/y-paeonia.js; then the page is rebuilt once for the next round. The last round's tables stay (fleur/sortie.py reads them).
import json,subprocess,sys,re,os,numpy as np
S=os.path.dirname(os.path.abspath(__file__));A='refcache/pivoine-herbacee-double/apparence';C='refcache/pivoine-herbacee-double/cw'
R=json.load(open(A+'/reperes.json',encoding='utf-8'));RFC='541,630;541,500;541,375;32'
n=int(sys.argv[1]);cws=sys.argv[2:] or [k for k in R if not k.startswith('_')]
def sh(*a):return subprocess.run(list(a),capture_output=True,text=True)
def shot(name,q):sh('sh','fleur/shot_p.sh',name,'grid=1&sid=pivoine-herbacee-double&st=1:0&view=0&D=700&det=2&seed=7&'+q);return 'fleur/out/%s.png'%name
def stats(t):
    ko=re.findall(r'^\| (\S+) \| ([0-9.]+) \| [^|]+ \| ([0-9.]+) \| ([0-9.]+) \|',t,re.M);m=re.search(r'axe[^;]*; écart moyen ([0-9.]+)',t)
    return len([x for x in ko if float(x[1])>6]),np.mean([float(x[1]) for x in ko]) if ko else -1,m.group(1) if m else '-'
for rd in range(1,n+1):
    for cw in cws:
        ph=lambda f:f"{C}/{f}".replace('.jpg','-wb.jpg') if cw in('blanc','blush') else f"{C}/{f}"
        out=[]
        for key,pf,solo in [('g1',R[cw][1],'g0'),('g2',R[cw][2],'g2')]:
            png=shot('cal_%s_%s'%(cw,solo),'cws=%s&solo=%s'%(cw,solo));rf=sh('python','fleur/repere.py',png,'--base','541,513').stdout.strip()
            sh('python','fleur/apparence.py','paire',ph(R[cw][0]),pf,png,rf,'--out',f'{A}/{cw}/{cw}-paire-{key}')
        png=shot('cal_%s_full'%cw,'cws=%s'%cw)
        sh('python','fleur/apparence.py','paire',ph(R['_coeur'][cw][0]),R['_coeur'][cw][1],png,RFC,'--out',f'{A}/{cw}/{cw}-paire-coeur')
        for key in('g1','g2','coeur'):
            t=open(f'{A}/{cw}/{cw}-paire-{key}.txt',encoding='utf-8').read();k,de,l=stats(t);out.append('%s ko %d dE %.1f lum %s'%(key,k,de,l))
        print('round',rd,cw,' | '.join(out),flush=True)
        if rd<n or '--fix-last' in sys.argv:
            for k,ps in(('g',[f'{A}/{cw}/{cw}-paire-g1.json',f'{A}/{cw}/{cw}-paire-g2.json']),('h',[f'{A}/{cw}/{cw}-paire-coeur.json'])):
                cur=f'.scratch/cal_{cw}_{k}.json';sh('python',S+'/gridio.py','get',cw,k,cur)
                r=sh('python','fleur/calibre.py',cur,*ps,'--out',cur,'--k','.8');sh('python',S+'/gridio.py','put',cw,k,cur)
                print('   ',k,r.stdout.strip()[-90:],r.stderr.strip()[-200:],flush=True)
    if rd<n:print(sh('sh','mkapp.sh').stdout.strip()[-60:],flush=True)
