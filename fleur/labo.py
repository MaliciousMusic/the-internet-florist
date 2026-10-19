"""labo.py [--loop N]: the state of the flower lab for the dashboard labo/index.html (served on the atelier's port, 8805/labo/).

Writes labo/data.json from what is already on disk, no model call, no browser:
  - the method: the steps of pipe.py, their model, effort and cap; the fleur-* agents and their model; the tools of fleur/, ws/, pilote/;
  - the sorts: every pipe-state.json and pipe-bill.json of the atelier and its chantiers (ch/*), step by step;
  - this session: the latest Claude Code transcript of the project and its subagents, priced in Opus input-equivalent tokens
    like bill.py (read incrementally: labo/.cache.json keeps the offsets and the sums);
  - the PC: the last line of the load log (fleur/res/*.csv) and the Chrome gate's slots (ws/locks/slot*).
labo/data.json and labo/.cache.json are local (they name the commands of the session): never committed."""
import sys, os, json, glob, re, time, ast
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, 'labo')
PROJ = os.path.expanduser('~/.claude/projects/C--Users-agent-Desktop-flower')
AGENTS = os.path.expanduser('~/.claude/agents')
sys.path.insert(0, HERE)
import bill as B  # W, M, activity: one pricing for the whole atelier

# the role of each step in plain words (the owner reads them), and who does it since the lilies wave (2026-10-18: heads drawn by the session)
ROLE = {
    'census': ('Recensement', 'cultivars, groupes, preuves KAVB et commerce, niveaux A à D'),
    'refs': ('Photos', 'photos nommées de Commons, stades, organes, paires de comparaison'),
    'coloris': ('Coloris', 'couleurs mesurées sur les photos, une par coloris'),
    'targets': ('Cibles', 'chiffres de forme pris sur les photos (sans modèle)'),
    'fiche': ('Fiche', 'fiche morphologique : tépales, cœur, tige, feuilles'),
    'forme': ('Forme de la tête', 'la tête en SVG : surfaces, matière, cœur'),
    'fit': ('Ajustement', 'réglages libres ajustés aux mesures, un regard Opus'),
    'plante': ('Tige et feuilles', 'la plante avec les pièces du kit'),
    'finition': ('Finition', 'coloris reportés dans la matière, tige et feuilles réglées'),
    'temoins': ('Témoins', 'les autres fleurs ne doivent pas bouger (sans modèle)'),
    'comparaison': ('Comparaison', 'photo et rendu au même cadrage, région par région'),
    'juge': ('Juge', 'un Opus neuf, en lecture seule, qui dit ok ou ko'),
    'qa': ('QA', 'lots headless surveillés, poids et éléments par tête'),
    'sortie': ('Sortie', 'la liste de sortie : les 14 points des bonnes pratiques vérifiés, bloquante (sortie.py)'),
    'planches': ('Planches', 'les planches finales pour la validation'),
}
NOW_BY = {'forme': 'session', 'fit': 'session', 'finition': 'session', 'comparaison': 'session'}  # heads drawn by hand since the lilies
TOOLS_FOR = {'sortie': 'sortie.py, trous.py, banc3d.js, volume.py, apparence.py', 'census': 'census.py, kavb.py', 'refs': 'refs.py, img.py', 'coloris': 'refs.py pal, apparence.py grille', 'targets': 'meas.py, prof.py, sil.py',
             'fiche': 'fiche.py', 'forme': 'apparence.py, shot_p.sh, sil.py, trous.py', 'fit': 'fit.py', 'plante': 'organ.py, jgap.py',
             'finition': 'td-de.py, td-back.py', 'temoins': 'shot_p.sh, img.py', 'comparaison': 'apparence.py paire, volume.py paire, img.py', 'juge': 'img.py',
             'qa': 'qawatch.sh, wsq.sh', 'planches': 'shot_p.sh, td-mont.py'}
KIND = {'apparence.py': 'mesure', 'volume.py': 'mesure', 'census.py': 'recherche', 'kavb.py': 'recherche', 'refs.py': 'mesure', 'img.py': 'image', 'heads.py': 'image', 'td-mont.py': 'image',
        'meas.py': 'mesure', 'prof.py': 'mesure', 'sil.py': 'mesure', 'trous.py': 'mesure', 'gstat.py': 'mesure', 'organ.py': 'mesure',
        'jgap.py': 'mesure', 'td-de.py': 'mesure', 'td-back.py': 'mesure', 'cwmed.py': 'mesure', 'qt.py': 'mesure', 'fit.py': 'modelage',
        'fiche.py': 'contrôle', 'pipe.py': 'pilote', 'bill.py': 'coût', 'labo.py': 'coût', 'chantier.sh': 'pilote', 'shot.sh': 'rendu',
        'shot_p.sh': 'rendu', 'skudump.sh': 'contrôle', 'offerdump.sh': 'contrôle', 'gate.sh': 'machine', 'qawatch.sh': 'machine',
        'chrome1.sh': 'rendu', 'chrome_rt.sh': 'rendu', 'dbgdump.sh': 'rendu', 'wsb.sh': 'rendu', 'wsq.sh': 'contrôle', 'wss.sh': 'rendu',
        'mksv.py': 'rendu', 'svtest.js': 'rendu'}


# the shell commands of the drawing work that bill.py files as plain « bash »
ACT_MORE = [('rendu', r'shot_p\.sh|chrome_rt|chrome1|gate\.sh|mksv|svtest'), ('pipe', r'pipe\.py|chantier\.sh|census\.py'),
            ('mesure', r'sil\.py|jgap|trous|gstat|td-|organ\.py|meas\.py|refs\.py'), ('image', r'cmp\.py|zoom\.py|PIL|Image\.open|img\.py'),
            ('édition code', r"python - <<|\.write\(|sed -i"), ('lecture code', r'grep|sed -n|head|cat')]


def activity(tl):
    a = B.activity(tl)
    if a != 'bash':
        return a
    cmd = ' '.join(inp.get('command', '') for n, inp in tl if n == 'Bash')
    return next((k for k, rx in ACT_MORE if re.search(rx, cmd)), 'bash')


def rd(p, default=None):
    try:
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return default


def eq_of(u, model):
    """Opus input-equivalent tokens of one usage row (bill.py's weights)"""
    k = next((x for x in B.M if x in (model or '')), 'opus')
    return (u.get('in', 0) * B.W['in'] + u.get('cw', 0) * B.W['cw'] + u.get('cr', 0) * B.W['cr'] + u.get('out', 0) * B.W['out']) * B.M[k]


def short_model(m):
    return next((x for x in ('opus', 'fable', 'sonnet', 'haiku') if x in (m or '')), m or '?')


# ---------- the method

def pipe_consts():
    src = open(os.path.join(HERE, 'pipe.py'), encoding='utf-8').read()
    tree = ast.parse(src)
    C = {}
    for n in tree.body:
        if isinstance(n, ast.Assign) and len(n.targets) == 1 and isinstance(n.targets[0], ast.Name):
            name = n.targets[0].id
            if name in ('STEPS', 'MODELS', 'STEP_CAP', 'EFFORT', 'TURNS', 'LIMIT', 'CAP_DEFAULT', 'PIPE_SLOTS', 'JUGE_EFFORT'):
                try:
                    C[name] = ast.literal_eval(n.value)
                except Exception:
                    pass
    calls = {}
    for line in src.splitlines():  # every model call of a step (the selftest's haiku calls with tools ['Read'] only are not the method)
        m = re.search(r"(?:call_model|model_loop)\(ctx, '([a-z]+)'", line)
        if not m or m.group(1) in ('x', 'models') or "['Read']" in line:
            continue
        for step in (('fit', 'plante') if "'fit' if part" in line else (m.group(1),)):
            for mod in re.findall(r"'(haiku|sonnet|opus)'", line):
                if mod not in calls.setdefault(step, []):
                    calls[step].append(mod)
    return C, calls


def method():
    C, calls = pipe_consts()
    steps = []
    for s in C.get('STEPS', []):
        ms = calls.get(s, [])
        steps.append(dict(id=s, name=ROLE.get(s, (s, ''))[0], role=ROLE.get(s, ('', ''))[1], models=ms or ['python'],
                          effort=[(C.get('JUGE_EFFORT') if s == 'juge' else C.get('EFFORT', {}).get(m)) for m in ms],
                          cap=C.get('STEP_CAP', {}).get(s), tools=TOOLS_FOR.get(s, ''), now=NOW_BY.get(s, 'pipe')))
    agents = []
    for p in sorted(glob.glob(os.path.join(AGENTS, 'fleur-*.md'))):
        t = open(p, encoding='utf-8').read()
        fm = dict(re.findall(r'^(\w+):\s*(.*)$', t.split('---')[1] if t.startswith('---') else '', re.M))
        agents.append(dict(name=fm.get('name', os.path.basename(p)[:-3]), model=fm.get('model', '?'), desc=fm.get('description', '')[:260]))
    tools = []
    for p in sorted(glob.glob(os.path.join(HERE, '*.py')) + glob.glob(os.path.join(HERE, '*.sh')) + glob.glob(os.path.join(ROOT, 'ws', '*.sh'))
                    + [os.path.join(ROOT, 'pilote', 'mksv.py'), os.path.join(ROOT, 'pilote', 'svtest.js')]):
        b = os.path.basename(p)
        if b.startswith('_') or not os.path.exists(p):
            continue
        d = ''
        try:
            t = open(p, encoding='utf-8').read()
            if b.endswith('.py'):
                d = (ast.get_docstring(ast.parse(t)) or '').split('\n')[0]
            else:
                d = next((l.lstrip('#/* ').strip() for l in t.splitlines()[:3] if l.startswith('#') and not l.startswith('#!') or l.startswith('/*')), '')
        except Exception:
            pass
        tools.append(dict(name=b, where=os.path.relpath(p, ROOT).replace('\\', '/'), kind=KIND.get(b, 'autre'), desc=d[:200]))
    return dict(steps=steps, agents=agents, tools=tools, cap_flower=C.get('CAP_DEFAULT'), slots=C.get('PIPE_SLOTS'),
                models=C.get('MODELS', {}), turns=C.get('TURNS', {}), limit=C.get('LIMIT', {}))


# ---------- the sorts

def sorts():
    out = []
    states = glob.glob(os.path.join(ROOT, 'refcache', '*', 'pipe-state.json')) + glob.glob(os.path.join(ROOT, 'ch', '*', 'refcache', '*', 'pipe-state.json'))
    for p in states:
        st = rd(p, {}) or {}
        d = os.path.dirname(p)
        rel = os.path.relpath(d, ROOT).replace('\\', '/')
        ch = rel.split('/')[1] if rel.startswith('ch/') else 'main'
        sid = st.get('sid') or os.path.basename(d)
        if sid == 'pipe-test':
            continue
        rows = rd(os.path.join(d, 'pipe-bill.json'), []) or []
        by = {}
        for r in rows:
            b = by.setdefault(r.get('step', '?'), dict(eq=0, usd=0, calls=0, turns=0, dur=0, models=[]))
            b['eq'] += r.get('eq') or 0
            b['usd'] += r.get('usd') or 0
            b['calls'] += 1
            b['turns'] += r.get('turns') or 0
            b['dur'] += r.get('dur') or 0
            m = r.get('model')
            if m and m not in b['models']:
                b['models'].append(m)
        steps = {}
        for k, v in (st.get('steps') or {}).items():
            steps[k] = dict(status=v.get('status'), msg=(v.get('msg') or '')[:400], started=v.get('started'), ended=v.get('ended'))
        last = max([v.get('ended') or v.get('started') or '' for v in (st.get('steps') or {}).values()] + [st.get('created') or ''])
        q = rd(os.path.join(d, 'questions.json'), []) or []
        out.append(dict(sid=sid, chantier=ch, taxon=st.get('taxon'), group=st.get('group'), steps=steps, bill=by,
                        eq=sum(b['eq'] for b in by.values()), usd=sum(b['usd'] for b in by.values()), last=last,
                        sortie=rd(os.path.join(d, 'sortie.json'), None),
                        questions=len(q) if isinstance(q, list) else len(q or {}), head_by_hand=os.path.exists(os.path.join(ROOT, 'ch', ch, 'app', 'y-lilium.js')) and sid.startswith('lis-')))
    out.sort(key=lambda s: s['last'] or '', reverse=True)
    return out


# ---------- this session

def session():
    files = sorted(glob.glob(os.path.join(PROJ, '*.jsonl')), key=os.path.getmtime, reverse=True)
    if not files:
        return {}
    main = files[0]
    sidn = os.path.basename(main)[:-6]
    cp = os.path.join(OUT, '.cache.json')
    cache = rd(cp, {}) or {}
    if cache.get('sid') != sidn:
        cache = dict(sid=sidn, files={})
    sub = sorted(glob.glob(os.path.join(PROJ, sidn, 'subagents', '*.jsonl')))
    for p in [main] + sub:
        key = os.path.basename(p)
        c = cache['files'].setdefault(key, dict(off=0, seen=[], usage={}, eq=0, calls=0, tools={}, acts={}, hours={}, recent=[], first=None, last=None, model=None))
        seen = set(c['seen'])
        size = os.path.getsize(p)
        if size < c['off']:
            c.update(off=0)
        with open(p, 'rb') as f:
            f.seek(c['off'])
            data = f.read()
        cut = data.rfind(b'\n') + 1
        for line in data[:cut].splitlines():
            try:
                e = json.loads(line)
            except Exception:
                continue
            ts = e.get('timestamp')
            if e.get('type') == 'user' and key == os.path.basename(main) and not e.get('isSidechain'):
                m = e.get('message') or {}
                ct = m.get('content')
                if isinstance(ct, str) and not ct.startswith(('<', '[Image', '[Request interrupted')):
                    c.setdefault('prompts', []).append([ts, ct[:220]])
                    c['prompts'] = c['prompts'][-12:]
            if e.get('type') != 'assistant':
                continue
            m = e.get('message') or {}
            mid = m.get('id')
            tl = [(x.get('name'), x.get('input') or {}) for x in (m.get('content') or []) if isinstance(x, dict) and x.get('type') == 'tool_use']
            for n, inp in tl:
                c['tools'][n] = c['tools'].get(n, 0) + 1
                desc = inp.get('description') or inp.get('file_path') or inp.get('pattern') or inp.get('query') or inp.get('url') or inp.get('prompt', '')[:80] or ''
                if n in ('Read', 'Write', 'Edit') and desc:
                    desc = os.path.basename(str(desc))
                c['recent'].append([ts, n, str(desc)[:140]])
            c['recent'] = c['recent'][-80:]
            u = m.get('usage')
            if not u or not mid:
                continue
            # one message comes as several entries (thinking, text, each tool use) with the same id: priced once, at its largest usage,
            # and filed under the activity of its tool uses once they appear
            row = dict(**{'in': u.get('input_tokens', 0)}, cw=u.get('cache_creation_input_tokens', 0), cr=u.get('cache_read_input_tokens', 0), out=u.get('output_tokens', 0))
            mod = short_model(m.get('model'))
            q = eq_of(row, mod)
            pend = c.setdefault('pend', {})
            old = pend.get(mid)
            if old is None and mid in seen:
                continue
            mu = c['usage'].setdefault(mod, {'in': 0, 'cw': 0, 'cr': 0, 'out': 0, 'eq': 0, 'calls': 0})
            a = activity(tl)
            h = (ts or '')[:13]
            if old is None:
                seen.add(mid)
                for k in ('in', 'cw', 'cr', 'out'):
                    mu[k] += row[k]
                mu['eq'] += q
                mu['calls'] += 1
                c['eq'] += q
                c['calls'] += 1
                c['acts'][a] = c['acts'].get(a, 0) + q
                if h:
                    c['hours'][h] = c['hours'].get(h, 0) + q
                pend[mid] = [q, a, h, row]
                if len(pend) > 40:
                    pend.pop(next(iter(pend)))
            else:
                q0, a0, h0, row0 = old
                dq = max(0, q - q0)
                for k in ('in', 'cw', 'cr', 'out'):
                    mu[k] += max(0, row[k] - row0[k])
                mu['eq'] += dq
                c['eq'] += dq
                if h0:
                    c['hours'][h0] = c['hours'].get(h0, 0) + dq
                a1 = a if (tl and a0 == 'réponse') else a0
                c['acts'][a0] = c['acts'].get(a0, 0) - q0
                c['acts'][a1] = c['acts'].get(a1, 0) + q0 + dq
                pend[mid] = [max(q, q0), a1, h0, {k: max(row[k], row0[k]) for k in row}]
            c['model'] = mod
            if ts:
                c['first'] = c['first'] or ts
                c['last'] = ts
        c['off'] += cut
        c['seen'] = list(seen)[-4000:]
        if key != os.path.basename(main):
            meta = rd(p[:-6] + '.meta.json', {}) or {}
            c['meta'] = dict(type=meta.get('agentType'), desc=meta.get('description'), model=meta.get('model'), effort=meta.get('effort'))
    os.makedirs(OUT, exist_ok=True)
    tmp = cp + '.tmp'
    with open(tmp, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(cache, f)
    os.replace(tmp, cp)
    F = cache['files']
    me = F.get(os.path.basename(main), {})
    usage, acts, hours = {}, {}, {}
    for k, c in F.items():
        for mod, v in c['usage'].items():
            t = usage.setdefault(mod, {'in': 0, 'cw': 0, 'cr': 0, 'out': 0, 'eq': 0, 'calls': 0})
            for x in t:
                t[x] += v.get(x, 0)
        for a, v in c['acts'].items():
            acts[a] = acts.get(a, 0) + v
        for h, v in c['hours'].items():
            hours[h] = hours.get(h, 0) + v
    subs = [dict(file=k, **(c.get('meta') or {}), eq=c['eq'], calls=c['calls'], first=c['first'], last=c['last'], tools=c['tools'])
            for k, c in F.items() if k != os.path.basename(main)]
    subs.sort(key=lambda s: s['first'] or '', reverse=True)
    title = (rd(os.path.join(PROJ, sidn, 'custom-title.json'), {}) or {}).get('title')
    return dict(id=sidn, title=title, model=me.get('model'), first=me.get('first'), last=me.get('last'), eq_self=me.get('eq', 0),
                eq=sum(c['eq'] for c in F.values()), calls=sum(c['calls'] for c in F.values()), usage=usage, acts=acts,
                hours=sorted(hours.items())[-36:], tools=me.get('tools', {}), recent=me.get('recent', [])[-50:], prompts=me.get('prompts', []), subagents=subs)


# ---------- the PC

def machine():
    logs = sorted(glob.glob(os.path.join(HERE, 'res', '*.csv')), key=os.path.getmtime, reverse=True)
    pc = {}
    if logs:
        with open(logs[0], 'rb') as f:
            f.seek(max(0, os.path.getsize(logs[0]) - 4000))
            lines = f.read().decode('ascii', 'replace').strip().splitlines()
        hdr = 'utc,cpu,ram_free_gb,gpu3d,chrome_headless,chrome_all,python,node'.split(',')
        rows = [dict(zip(hdr, l.split(','))) for l in lines[1:] if l and l[0] == '2']
        if rows:
            pc = dict(rows[-1], log=os.path.basename(logs[0]), ram_series=[float(r['ram_free_gb']) for r in rows[-40:]],
                      cpu_series=[float(r['cpu']) for r in rows[-40:]])
    slots = []
    for i in (1, 2, 3):
        d = os.path.join(ROOT, 'ws', 'locks', 'slot%d' % i)
        if os.path.isdir(d):
            try:
                t = int(open(os.path.join(d, 't')).read().strip())
            except Exception:
                t = 0
            slots.append(dict(slot=i, since=int(time.time()) - t if t else None))
    return dict(pc=pc, gate=slots, gate_max=3, ram_floor=3.0)


def main():
    os.makedirs(OUT, exist_ok=True)
    d = dict(at=time.strftime('%Y-%m-%dT%H:%M:%S'), method=method(), sorts=sorts(), session=session(), machine=machine())
    tmp = os.path.join(OUT, 'data.json.tmp')
    with open(tmp, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(d, f, ensure_ascii=False)
    os.replace(tmp, os.path.join(OUT, 'data.json'))
    return d


if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[1] == '--loop':
        while True:
            try:
                main()
            except Exception as e:
                print('labo:', e, file=sys.stderr)
            time.sleep(float(sys.argv[2]))
    else:
        t = time.time()
        d = main()
        s = d['session']
        print('labo/data.json: %d sorts, %d steps, %d agents, %d tools; session %.1f M eq-Opus (%d calls, %d subagents); %.1f s'
              % (len(d['sorts']), len(d['method']['steps']), len(d['method']['agents']), len(d['method']['tools']), s.get('eq', 0) / 1e6,
                 s.get('calls', 0), len(s.get('subagents', [])), time.time() - t))
