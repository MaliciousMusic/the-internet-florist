"""bill.py: the exact token bill of one flower, read from the Claude Code transcripts (the orchestrating session and every subagent).

  python bill.py mark <sid> start|end          the species' work starts / ends (UTC) -> bills.json
  python bill.py step <sid> <name>             the orchestrator starts a step (its own calls are split by these marks)
  python bill.py match <sid> <regex>           count only the subagents whose description matches (several species at once)
  python bill.py report <sid>                  the bill, written to bills/<sid>.md and printed
  python bill.py window <from> <to>            a time window (ISO, UTC), e.g. 2026-10-08T07 2026-10-08T12

Every model call is counted once (by message id); its output is the larger of the logged count and an estimate from what it wrote and priced in « Opus input-equivalent tokens »: input 1, cache write 1.25, cache read 0.1,
output 5; Sonnet 0.6 and Haiku 0.2 of Opus. Each call is put in:
  - a group: the orchestrator's step, or the subagent (its type and description);
  - an activity, from the tools it calls (wikimedia, measure, image, render, build, code edit, code read, qa, web, answer...);
  - « after error » when the tool result just before it was an error (the retouches the errors cost)."""
import sys, os, json, glob, time, re
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

PROJ = os.path.expanduser('~/.claude/projects/C--Users-agent-Desktop-flower')
HERE = os.path.dirname(os.path.abspath(__file__))
BILLS = os.path.join(HERE, 'bills.json')
W = {'in': 1, 'cw': 1.25, 'cr': .1, 'out': 5}
M = {'opus': 1, 'fable': 1, 'sonnet': .6, 'haiku': .2}
ACT = [('wikimedia', r'refs\.py (find|sheet|url|kept)'), ('mesure', r'refs\.py (pal|ring|keep|list|clean)'), ('rendu', r'shot\.sh|snapSvg'),
       ('image', r'img\.py'), ('qa', r'qawatch|qa13'), ('build', r'mkapp|mksv|mkqa|mkpl|sync_demo'), ('git', r'\bgit\b'), ('bill', r'bill\.py')]


def now():
    return time.strftime('%Y-%m-%dT%H:%M:%S', time.gmtime())


def activity(tools):
    """the activity of one call from its tool uses [(name, input)]"""
    if not tools:
        return 'réponse'
    labs = []
    for n, inp in tools:
        if n == 'Bash':
            c = inp.get('command', '')
            lab = next((a for a, rx in ACT if re.search(rx, c)), 'bash')
        elif n == 'Read':
            lab = 'image' if re.search(r'\.(png|jpe?g|webp)$', inp.get('file_path', ''), re.I) else 'lecture code'
        elif n in ('Edit', 'Write', 'NotebookEdit'):
            lab = 'édition code'
        elif n in ('Grep', 'Glob'):
            lab = 'lecture code'
        elif n in ('WebSearch', 'WebFetch'):
            lab = 'web'
        elif n in ('Agent', 'SendMessage', 'TaskStop'):
            lab = 'orchestration'
        elif n.startswith('mcp__Claude_Browser'):
            lab = 'navigateur'
        else:
            lab = n.split('__')[-1]
        labs.append(lab)
    return max(set(labs), key=labs.count)


def calls(f, t0, t1):
    """the model calls of one transcript in [t0, t1): (ts, model, usage, activity, after_error, images_in_results_before)"""
    msgs, order, err, imgs = {}, [], False, 0
    for line in open(f, encoding='utf-8', errors='replace'):
        try:
            o = json.loads(line)
        except Exception:
            continue
        ts = o.get('timestamp') or ''
        m = o.get('message') or {}
        if not isinstance(m, dict):
            continue
        if o.get('type') == 'user':
            c = m.get('content')
            if isinstance(c, list):
                for b in c:
                    if isinstance(b, dict) and b.get('type') == 'tool_result':
                        err = err or bool(b.get('is_error'))
                        bc = b.get('content')
                        if isinstance(bc, list):
                            imgs += sum(1 for x in bc if isinstance(x, dict) and x.get('type') == 'image')
            continue
        if o.get('type') != 'assistant' or not m.get('usage'):
            continue
        mid = m.get('id')
        if mid not in msgs:
            msgs[mid] = {'ts': ts, 'model': (m.get('model') or '?').lower(), 'u': m['usage'], 'tools': [], 'err': err, 'img': imgs}
            order.append(mid)
            err, imgs = False, 0
        elif (m['usage'].get('output_tokens') or 0) > (msgs[mid]['u'].get('output_tokens') or 0):
            msgs[mid]['u'] = m['usage']  # a streamed answer: its last line carries the full output count
        for b in m.get('content') or []:
            if isinstance(b, dict) and b.get('type') == 'tool_use':
                msgs[mid]['tools'].append((b.get('name', ''), b.get('input') or {}))
            if isinstance(b, dict):
                msgs[mid]['ch'] = msgs[mid].get('ch', 0) + len(b.get('text') or '') + len(b.get('thinking') or '') + (len(json.dumps(b.get('input'), ensure_ascii=False)) if b.get('type') == 'tool_use' else 0)
    out = []
    for mid in order:
        x = msgs[mid]
        if t0 <= x['ts'] < t1:
            u = dict(x['u'])
            # the transcripts often keep only the first streamed chunk's usage: the output is then estimated from what was written (3.5 chars a token)
            u['output_tokens'] = max(u.get('output_tokens') or 0, int(x.get('ch', 0) / 3.5))
            out.append((x['ts'], x['model'], u, activity(x['tools']), x['err'], x['img']))
    return out


def eq(model, u):
    k = next((x for x in M if x in model), None)
    return (u.get('input_tokens', 0) * W['in'] + u.get('cache_creation_input_tokens', 0) * W['cw'] + u.get('cache_read_input_tokens', 0) * W['cr']
            + u.get('output_tokens', 0) * W['out']) * M.get(k, 1)


def dur(a, b):
    f = '%Y-%m-%dT%H:%M:%S'
    return max(0, time.mktime(time.strptime(b[:19], f)) - time.mktime(time.strptime(a[:19], f)))


def res(sid):
    """the load samples of a species: [(utc, cpu, ram, gpu, headless chromes)]"""
    out = []
    for p in glob.glob(os.path.join(HERE, 'res', '*.csv')):  # every sampling run; each group reads its own time window
      for line in open(p, encoding='ascii').read().splitlines()[1:]:
        x = line.split(',')
        try:
            out.append((x[0], float(x[1] or 0), float(x[2] or 0), float(x[3] or 0), int(x[4] or 0)))
        except Exception:
            pass
    return sorted(out)


def mname(model):
    return next((x for x in M if x in model), model)


def bill(t0, t1, steps=None, title='', match=None):
    """steps: [(name, ts)] for the orchestrator's calls; returns the report as markdown lines"""
    groups, acts, errs = {}, {}, {}
    tot = 0
    for f in glob.glob(os.path.join(PROJ, '*.jsonl')) + glob.glob(os.path.join(PROJ, '*', 'subagents', '*.jsonl')):
        if os.path.getmtime(f) < time.mktime(time.strptime(t0[:13], '%Y-%m-%dT%H')) - 3600:
            continue
        sub = os.sep + 'subagents' + os.sep in f or '/subagents/' in f
        label = None
        if sub:
            try:
                meta = json.load(open(f[:-6] + '.meta.json', encoding='utf-8'))
                label = f"{meta.get('agentType', '?')} : {meta.get('description', '')}"
            except Exception:
                label = 'sous-agent ' + os.path.basename(f)[6:14]
            if match and not re.search(match, label, re.I):
                continue  # another species' agent working at the same time
        for ts, model, u, act, er, im in calls(f, t0, t1):
            if not sub:
                g = 'orchestrateur'
                if steps:
                    cur = None
                    for n, st in steps:
                        if st <= ts:
                            cur = n
                    g = 'orchestrateur · ' + (cur or 'avant')
            else:
                g = label
            e = eq(model, u)
            tot += e
            G = groups.setdefault(g, {'model': set(), 'calls': 0, 'ctx': 0, 'out': 0, 'eq': 0, 'err': 0, 'erreq': 0, 'img': 0, 'first': ts, 'last': ts})
            G['last'] = max(G['last'], ts)
            G['model'].add(mname(model))
            G['calls'] += 1
            G['ctx'] += u.get('cache_read_input_tokens', 0) + u.get('cache_creation_input_tokens', 0) + u.get('input_tokens', 0)
            G['out'] += u.get('output_tokens', 0)
            G['eq'] += e
            G['img'] += im
            G['first'] = min(G['first'], ts)
            if er:
                G['err'] += 1
                G['erreq'] += e
            A = acts.setdefault(act, [0, 0])
            A[0] += 1
            A[1] += e
            if er:
                E = errs.setdefault(act, [0, 0])
                E[0] += 1
                E[1] += e
    R = res(title)
    L = [f'# Facture en tokens : {title}', '', f'Fenêtre {t0} → {t1} (UTC). Unité : token « équivalent entrée Opus » (M = million).', '',
         '## Par étape et par agent', '', '| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |',
         '|---|---|---|---|---|---|---|---|---|']
    for g, G in sorted(groups.items(), key=lambda x: x[1]['first']):
        L.append(f"| {g} | {'/'.join(sorted(G['model']))} | {G['calls']} | {G['ctx'] / max(1, G['calls']) / 1e3:.0f} k | {G['out'] / 1e3:.0f} k | {G['img']} | "
                 f"{G['err']} ({G['erreq'] / 1e6:.2f} M) | {G['eq'] / 1e6:.2f} M | {G['eq'] / max(1, tot) * 100:.0f} % |")
    L += ['', '## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)', '',
          '| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |', '|---|---|---|---|---|---|---|']
    for g, G in sorted(groups.items(), key=lambda x: x[1]['first']):
        d = dur(G['first'], G['last'])
        S = [r for r in R if G['first'][:19] <= r[0] <= G['last'][:19]]
        if S:
            rr = f"{sum(r[1] for r in S) / len(S):.0f} / {max(r[1] for r in S):.0f} % | {min(r[2] for r in S):.1f} Go | {sum(r[3] for r in S) / len(S):.0f} / {max(r[3] for r in S):.0f} % | {max(r[4] for r in S)}"
        else:
            rr = '— | — | — | —'
        L.append(f"| {g} | {G['first'][11:19]} → {G['last'][11:19]} | {d // 60:.0f} min {d % 60:02.0f} s | {rr} |")
    if groups:
        t_a, t_b = min(G['first'] for G in groups.values()), max(G['last'] for G in groups.values())
        L.append('')
        L.append(f"Durée totale : {dur(t_a, t_b) / 60:.0f} min. Somme des durées des groupes : {sum(dur(G['first'], G['last']) for G in groups.values()) / 60:.0f} min (au-dessus de la durée totale : du travail en parallèle).")
    L += ['', '## Par activité', '', '| Activité | Appels | Équivalent | Part | Dont après erreur |', '|---|---|---|---|---|']
    for a, (n, e) in sorted(acts.items(), key=lambda x: -x[1][1]):
        en = errs.get(a, [0, 0])
        L.append(f'| {a} | {n} | {e / 1e6:.2f} M | {e / max(1, tot) * 100:.0f} % | {en[0]} appels, {en[1] / 1e6:.2f} M |')
    ne = sum(v[0] for v in errs.values())
    ee = sum(v[1] for v in errs.values())
    L += ['', f'**Total : {tot / 1e6:.2f} M**, dont {ne} appels de retouche après erreur ({ee / 1e6:.2f} M, {ee / max(1, tot) * 100:.0f} %).']
    return L


def save(B):
    # atomic: a reader never sees a half-written file
    with open(BILLS + '.tmp', 'w', encoding='utf-8') as f:
        json.dump(B, f, indent=1, ensure_ascii=False)
    os.replace(BILLS + '.tmp', BILLS)


if __name__ == '__main__':
    a = sys.argv[1:]
    LK = BILLS + '.lock'
    if a[0] in ('mark', 'step', 'match'):
        # several flower sessions write here at once: a directory lock, stale after 60 s
        for _ in range(600):
            try:
                os.mkdir(LK)
                break
            except FileExistsError:
                try:
                    if time.time() - os.path.getmtime(LK) > 60:
                        os.rmdir(LK)
                except OSError:
                    pass
                time.sleep(.1)
        import atexit
        atexit.register(lambda: os.path.isdir(LK) and os.rmdir(LK))
    B = json.load(open(BILLS, encoding='utf-8')) if os.path.exists(BILLS) else {}
    if a[0] in ('mark', 'step'):
        b = B.setdefault(a[1], {})
        if a[0] == 'mark':
            b[a[2]] = now()
        else:
            b.setdefault('steps', []).append([a[2], now()])
        save(B)
        print(a[1], a[0], a[2], now())
    elif a[0] == 'match':
        B.setdefault(a[1], {})['match'] = a[2]
        save(B)
        print(a[1], 'match', a[2])
    elif a[0] == 'report':
        b = B[a[1]]
        L = bill(b['start'], b.get('end', now()), b.get('steps'), a[1], b.get('match'))
        os.makedirs(os.path.join(HERE, 'bills'), exist_ok=True)
        open(os.path.join(HERE, 'bills', a[1] + '.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
        print('\n'.join(L))
    elif a[0] == 'window':
        print('\n'.join(bill(a[1], a[2], None, a[1] + ' → ' + a[2])))
