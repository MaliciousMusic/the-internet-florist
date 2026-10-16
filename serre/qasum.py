import json,sys
from collections import Counter
F=Counter();U=Counter();K=Counter();tot=0;wf=0;wu=0;wk=0
for fn in sys.argv[1:]:
    try: d=json.load(open(fn,encoding='utf-8'))
    except Exception as e: print(fn,'ERR',open(fn).read()[:300]); continue
    for r in d['rs']:
        tot+=1; wf+=bool(r['F']); wu+=bool(r['U']); wk+=bool(r.get('K'))
        for k in r.get('K',[]): K[k[4].split('@')[0].split('~')[0]]+=1
        for k in r['F']:
            o=k[2]; F[(o[0],o[1],o[2].split('@')[0].split('~')[0]) if o else '?']+=1
        for u in r['U']:
            U[(u[1],u[2],u[3].split('@')[0],u[4])]+=1
        if r['F'] or r['U']: print(r['n'],'F',[(k[0],k[1],k[2][2].split('@')[0] if k[2] else '?') for k in r['F']][:5],'U',[(u[0],u[1],u[2],u[3].split('@')[0]) for u in r['U']][:5])
print('bouquets',tot,'withF',wf,'withU',wu,'withKinks',wk)
print('KINKS:',K.most_common(30))
print('FLOATING:',F.most_common(40))
print('UNDER:',U.most_common(30))
