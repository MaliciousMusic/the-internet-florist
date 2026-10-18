#!/usr/bin/env python
"""pipe.py: the deterministic pilot of ONE flower sort through the whole /fleur method (Belai's Flowers).

  python fleur/pipe.py run <sid> --taxon "<Genus species>" [--family F] [--ch <copy>] [--from <step>] [--only <step>] [--cap <M>]
                              [--skus "lilas~0:Ruhm von Horstenstein,..."] [--genus G] [--group "..."] [--kavb] [--skip-census]
                              [--kit y3-rose.js] [--late N] [--juge-tours 2] [--opus-effort xhigh] [--dry]
  python fleur/pipe.py status <sid>      the steps, their checks, the bill so far
  python fleur/pipe.py bill <sid>        the bill by step, in Opus input-equivalent tokens
  python fleur/pipe.py models            three tiny calls: which models the chosen CLI accepts (bills them under refcache/pipe-test)

Every step that needs a model is a fresh `claude -p` call (short prompt, empty context, closed tool list, capped turns); between two
steps the checks are numbers computed here in Python. State: refcache/<sid>/pipe-state.json (resume with --from), bill:
refcache/<sid>/pipe-bill.json (one line per call). Steps: census refs coloris targets forme fit plante finition comparaison juge temoins
qa planches. Pipe v3: Opus at effort xhigh, the atelier server on FLEUR_PORT (8805; 8765 belongs to another application and is never
touched), private copies of the shared scripts that aimed at 8765 (fleur/shot_p.sh...), census levels A/B/C accepted (D = a question),
photos kept only once looked at, a photo/render comparison pair by pair and an adversarial judge that is not the modeller.
Rules kept from the method: one Opus at a time per working copy, three sorts at most on the PC (ws/locks/pipe-<n>), renders through
the gate (shot_p.sh), ramwait.sh before every Opus call and heavy render, no commit and no merge anywhere, never a process that this
script did not start itself."""
import sys, os, re, json, time, math, glob, shutil, argparse, subprocess, threading, queue, contextlib, io, importlib.util, unicodedata, statistics, hashlib

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
MAIN = 'C:/Users/agent/Desktop/flower/flower-atelier'  # the shared atelier: gate, locks, servers (never modified here)
FC = 'C:/Users/agent/Desktop/flower/flower-atelier'    # the-internet-florist: standards read in docs/, sheets copied to catalogue/serre
STEPS = ['census', 'refs', 'coloris', 'targets', 'fiche', 'forme', 'fit', 'plante', 'finition', 'comparaison', 'juge', 'temoins', 'qa', 'planches']
MODELS = {'haiku': 'claude-haiku-5-5', 'sonnet': 'claude-sonnet-5-5', 'opus': 'claude-opus-5-5'}
W = {'in': 1, 'cw': 1.25, 'cr': .1, 'out': 5}  # Opus input-equivalent weights (bill.py)
M = {'opus': 1, 'sonnet': .6, 'haiku': .2}
try:  # one source of truth when bill.py is next to us
    sys.path.insert(0, HERE)
    import bill as _bill
    if all(k in _bill.W for k in W) and all(k in _bill.M for k in M):
        W, M = dict(_bill.W), dict(_bill.M)
except Exception:
    pass
TURNS = {'haiku': 40, 'sonnet': 40, 'opus': 60}          # --max-turns per call
LIMIT = {'haiku': 1200, 'sonnet': 1800, 'opus': 5400}   # wall-clock seconds per call
EFFORT = {'haiku': 'low', 'sonnet': 'medium', 'opus': 'xhigh'}
TARGET_EL, TARGET_KB = 300, 50                          # budget per head at DET 1: a MEASURE only since 2026-10-17 (the owner: quality first)
SEED = 7                                                # every sheet of the pipeline is drawn with &seed=7 (BONNES-PRATIQUES 9.1)
OLD_PORT = 8765                                         # another application of the owner: never used, never probed
PRIVATE = ('shot.sh', 'skudump.sh', 'offerdump.sh')     # shared scripts copied as <name>_p.sh with the atelier's port (always)
RAMWAIT = MAIN + '/fleur/res/ramwait.sh'                # waits for 4.5 GB of free RAM (PIPE_RAMWAIT overrides; '' = off)
PAIR_H, PAIR_W = 1100, 2400                             # img.py pair tiles of refaire.sh: height, width cap (img.py alone: 420, 900)
JUGE_TURNS = 60                                         # --max-turns of a judge call: up to 18 pairs, each image and its .txt, plus zooms
JUGE_TOURS = 2                                          # judge ko -> comparaison -> judge: round trips at most, then refusal (exit 2)


def port():
    """the atelier server's port: FLEUR_PORT, 8805 by default (read at every use: the selftest changes it)"""
    p = int(os.environ.get('FLEUR_PORT') or 8805)
    if p in (OLD_PORT, 8766):
        raise SystemExit('FLEUR_PORT=%d is forbidden (another application of the owner)' % p)
    return p


SYSTEM = ("You are one worker of a scripted pipeline for Belai's Flowers (a flower game: stems, bouquets, auction house). Work in the current "
          "directory only. Every Bash command prints 20 lines at most (pipe to head or tail; details go to files read by chunks). Write files in "
          "French for docs and reports, English for code and comments. Game vocabulary only (never invest, yield, trading, speculation). "
          "No 3D, no embedded images, no ribbons, never a bulb, root or soil. No git commit, merge or push. Never stop, kill or suspend a "
          "process you did not start; never use port 8766 nor 8765 (other applications): renders go through fleur/shot_p.sh. No secret in "
          "any file. Third-party photos stay in refcache/. Your LAST line is one single-line JSON object as the step asks; nothing after it.")
DENY = ['Bash(kill*)', 'Bash(taskkill*)', 'Bash(*Stop-Process*)', 'Bash(pkill*)', 'Bash(rm -rf*)', 'Bash(git commit*)', 'Bash(git push*)',
        'Bash(git merge*)', 'Bash(git reset*)', 'Bash(*8766*)', 'Bash(*:8765*)', 'Bash(sh fleur/shot.sh*)']
READ = ['Read', 'Grep', 'Glob']
SAFE_BASH = ['Bash(python *)', 'Bash(sh *)', 'Bash(cd *)', 'Bash(ls *)', 'Bash(cat *)', 'Bash(head *)', 'Bash(tail *)', 'Bash(wc *)', 'Bash(grep *)',
             'Bash(sed -n *)', 'Bash(echo *)', 'Bash(mkdir *)', 'Bash(cp *)', 'Bash(date*)']
WEB = ['WebSearch', 'WebFetch']


def now():
    return time.strftime('%Y-%m-%dT%H:%M:%S')


def say(*a):
    print(*a, flush=True)


def jload(p, dflt=None):
    try:
        return json.load(open(p, encoding='utf-8'))
    except Exception:
        return dflt


_JLOCK = threading.Lock()


def jsave(p, o):
    # several steps run model calls in threads: one writer at a time, a temp name per thread, the file closed before the replace (Windows)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    tmp = p + '.tmp%d_%d' % (os.getpid(), threading.get_ident())
    with _JLOCK:
        with open(tmp, 'w', encoding='utf-8') as f:
            json.dump(o, f, ensure_ascii=False, indent=1)
        for k in range(5):
            try:
                os.replace(tmp, p)
                return
            except PermissionError:
                time.sleep(.2 * (k + 1))
        os.replace(tmp, p)


def slug(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def norm(s):
    return re.sub(r'[^a-z0-9]+', ' ', unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode().lower()).strip()


def fwd(p):
    return str(p).replace('\\', '/')


def sh_exe():
    return shutil.which('sh') or 'C:/Program Files/Git/bin/sh.exe'


# ---------------------------------------------------------------------------------------------------------------- the CLI

def find_claude():
    """the newest Claude Code binary of the desktop application (2.1.288 and 2.1.293 accept the 5.5 models; the global npm 2.1.49 hangs on them)"""
    if os.environ.get('PIPE_CLAUDE'):
        return os.environ['PIPE_CLAUDE']
    best = None
    for p in glob.glob(os.path.join(os.environ.get('APPDATA', ''), 'Claude', 'claude-code', '*', '*', 'claude.exe')):
        v = tuple(int(x) for x in re.findall(r'\d+', os.path.basename(os.path.dirname(os.path.dirname(p)))))
        if best is None or v > best[0]:
            best = (v, p)
    return best[1] if best else shutil.which('claude')


DROP = re.compile(r'^(CLAUDECODE|CLAUDE_PID|CLAUDE_EFFORT|CLAUDE_PREVIEW.*|CLAUDE_AGENT_SDK.*|CLAUDE_CODE_(SESSION_ID|HOST_SESSION_ID|MESSAGING_.*|CHILD_SESSION|'
                  r'ENTRYPOINT|EXECPATH|SDK_.*|SESSION_ATTENDED|DESKTOP_APP_VERSION|TERMINAL_MCP_TOOLS|EMIT_.*|ENABLE_.*|REPORT_FINDINGS|EAGER_FLUSH|DISABLE_.*|'
                  r'ACCOUNT_UUID|ORGANIZATION_UUID|USER_EMAIL))$')


def child_env():
    """the session variables of a parent Claude Code are dropped: the child is an independent run on the stored sign-in"""
    return {k: v for k, v in os.environ.items() if not DROP.match(k)}


# ---------------------------------------------------------------------------------------------------------------- locks

LOCKS = MAIN + '/ws/locks'


def pid_alive(pid):
    """read-only liveness test (os.kill(pid, 0) would TERMINATE the process on Windows)"""
    try:
        import ctypes
        k = ctypes.windll.kernel32
        h = k.OpenProcess(0x1000, False, int(pid))
        if not h:
            return False
        code = ctypes.c_ulong()
        ok = k.GetExitCodeProcess(h, ctypes.byref(code))
        k.CloseHandle(h)
        return bool(ok) and code.value == 259
    except Exception:
        return True


class Lock:
    """a mkdir lock in ws/locks like gate.sh's: info.json = who holds it, t = heartbeat; stale when the holder is dead or silent for 3 hours"""

    def __init__(self, names, sid):
        self.names, self.sid, self.name = names, sid, None

    def _stale(self, d):
        info = jload(d + '/info.json', {})
        t = os.path.getmtime(d + '/info.json') if os.path.exists(d + '/info.json') else 0
        return (info.get('pid') and not pid_alive(info['pid'])) or time.time() - t > 3 * 3600

    def try_acquire(self):
        os.makedirs(LOCKS, exist_ok=True)
        for n in self.names:
            d = '%s/%s' % (LOCKS, n)
            if os.path.isdir(d) and self._stale(d):
                shutil.rmtree(d, ignore_errors=True)
            try:
                os.mkdir(d)
            except OSError:
                continue
            self.name = n
            self.beat()
            return True
        return False

    def beat(self):
        if self.name:
            try:
                jsave('%s/%s/info.json' % (LOCKS, self.name), {'pid': os.getpid(), 'sid': self.sid, 't': now()})
            except OSError:
                pass  # a missed heartbeat is harmless: the lock is stale only after 3 hours of silence

    def acquire(self, wait=True, poll=20, say_every=300):
        t0, last = time.time(), 0
        while not self.try_acquire():
            if not wait:
                return False
            if time.time() - last > say_every:
                say('lock %s busy, waiting' % self.names[0].rsplit('-', 1)[0])
                last = time.time()
            time.sleep(poll)
        return True

    def release(self):
        if self.name:
            shutil.rmtree('%s/%s' % (LOCKS, self.name), ignore_errors=True)
            self.name = None


# ---------------------------------------------------------------------------------------------------------------- the bill

class Bill:
    """pipe-bill.json: one entry per `claude -p` call; Opus input-equivalent tokens with the weights of bill.py"""

    def __init__(self, path):
        self.path, self.lk = path, threading.Lock()

    def rows(self):
        return jload(self.path, [])

    @staticmethod
    def eq(model, u):
        k = next((x for x in M if x in (model or '')), 'opus')
        return (u.get('in', 0) * W['in'] + u.get('cw', 0) * W['cw'] + u.get('cr', 0) * W['cr'] + u.get('out', 0) * W['out']) * M[k]

    def add(self, row):
        with self.lk:
            rows = self.rows()
            rows.append(row)
            jsave(self.path, rows)

    def total(self):
        return sum(r.get('eq', 0) for r in self.rows())

    def table(self):
        by, order = {}, []
        for r in self.rows():
            s = by.setdefault(r['step'], {'calls': 0, 'in': 0, 'cw': 0, 'cr': 0, 'out': 0, 'eq': 0, 's': 0, 'turns': 0})
            if r['step'] not in order:
                order.append(r['step'])
            s['calls'] += 1
            s['turns'] += r.get('turns', 0)
            s['s'] += r.get('dur', 0)
            for k in ('in', 'cw', 'cr', 'out', 'eq'):
                s[k] += r.get(k, 0)
        tot = sum(s['eq'] for s in by.values()) or 1
        L = ['%-11s %5s %6s %9s %9s %10s %8s %9s %6s' % ('step', 'calls', 'turns', 'in', 'cache-w', 'cache-r', 'out', 'eq-Opus', 'share')]
        for k in order:
            s = by[k]
            L.append('%-11s %5d %6d %9d %9d %10d %8d %9d %5.0f%%' % (k, s['calls'], s['turns'], s['in'], s['cw'], s['cr'], s['out'], s['eq'], 100 * s['eq'] / tot))
        mod = {}
        for r in self.rows():
            mod[r['model']] = mod.get(r['model'], 0) + r.get('eq', 0)
        L.append('%-11s %5d %6d %9d %9d %10d %8d %9d' % ('TOTAL', sum(s['calls'] for s in by.values()), sum(s['turns'] for s in by.values()),
                 *(sum(s[k] for s in by.values()) for k in ('in', 'cw', 'cr', 'out', 'eq'))))
        L.append('by model (eq-Opus): ' + ', '.join('%s %d' % (k, v) for k, v in mod.items()) + ' ; time %d min' % (sum(s['s'] for s in by.values()) / 60))
        return L


class CapReached(Exception):
    pass


class StepFailed(Exception):
    pass


# ---------------------------------------------------------------------------------------------------------------- the run context

class Ctx:
    def __init__(self, sid, ch, a, st):
        self.sid, self.ch, self.a, self.st = sid, fwd(ch), a, st
        self.rc = '%s/refcache/%s' % (self.ch, sid)          # absolute
        self.rel = 'refcache/%s' % sid                       # what the prompts say (cwd = the working copy)
        self.dry = bool(getattr(a, 'dry', False))
        self.cap = float(getattr(a, 'cap', 40) or 40) * 1e6
        self.bill = Bill(self.rc + '/pipe-bill.json')
        self.claude = getattr(a, 'claude', None) or find_claude()
        self.rel_url = fwd(os.path.relpath(self.ch, MAIN)) if fwd(self.ch).startswith(MAIN) else ''  # ch/outils, in the server's URLs
        self.lock_opus = None
        self.reads = {}  # step -> the files the model calls of that step opened with Read (normalised paths)
        self.cmds = {}   # step -> the Bash commands the model calls of that step ran (the fiche check counts its measuring tools)
        os.makedirs(self.rc + '/pipe-logs', exist_ok=True)

    def url(self, path, main=False):
        """an URL of the atelier server (port of FLEUR_PORT) for a page of this copy (or of the main atelier)"""
        rel = '' if main else self.rel_url
        return 'http://localhost:%d/%s%s' % (port(), (rel + '/') if rel else '', path)

    def npath(self, p):
        """a path as the model wrote it (relative to the copy, absolute, or /c/... of Git Bash), normalised for comparisons"""
        p = fwd(p or '').strip()
        m = re.match(r'^/([a-zA-Z])/(.*)$', p)
        if m:
            p = '%s:/%s' % (m[1], m[2])
        if not re.match(r'^[A-Za-z]:/', p):
            p = self.ch + '/' + p
        return os.path.normcase(os.path.normpath(p))

    def read_by(self, step, rel):
        return self.npath(rel) in self.reads.get(step, set())

    @property
    def taxon(self):
        return self.st['taxon']

    @property
    def genus(self):
        return self.st.get('genus') or self.taxon.split()[0]

    def sub(self, **kw):
        base = dict(sid=self.sid, taxon=self.taxon, genus=self.genus, family=self.st.get('family') or '', rc=self.rel, late=self.st.get('late') or 1,
                    skus='; '.join('%s = %s' % (x['sku'], x.get('cultivar') or '?') for x in self.st.get('skus', [])) or '-', ch=self.ch)
        base.update(kw)
        return base

    def beat(self):
        for lk in (getattr(self, 'slot', None), getattr(self, 'held', None)):
            if lk:
                lk.beat()

    def note(self, step, **kw):
        s = self.st['steps'].setdefault(step, {})
        s.update(kw)
        self.st['updated'] = now()
        self.beat()
        if not self.dry:
            jsave(self.rc + '/pipe-state.json', self.st)


def prompt_text(name, **kw):
    p = '%s/pipe/prompts/%s.md' % (HERE, name)
    t = open(p, encoding='utf-8').read()
    for k, v in kw.items():
        t = t.replace('<<%s>>' % k, str(v))
    left = sorted(set(re.findall(r'<<(\w+)>>', t)))
    if left:
        raise StepFailed('prompt %s: placeholders without value: %s' % (name, ', '.join(left)))
    return t


def killtree(p):
    """end a child THIS script started, with its own children (a gate, a Chrome of ours): taskkill on our own pid only"""
    try:
        subprocess.run(['taskkill', '/F', '/T', '/PID', str(p.pid)], capture_output=True, timeout=30)
    except Exception:
        pass
    try:
        p.kill()
    except Exception:
        pass


def run_cmd(ctx, argv, tag, timeout=1800, quiet=False):
    """a deterministic command in the working copy; the whole output goes to pipe-logs/<tag>.log, the caller gets (code, text)"""
    line = ' '.join(a if not re.search(r'\s', a) else '"%s"' % a for a in argv)
    if ctx.dry:
        say('  [dry] $ ' + line[:400])
        return 0, ''
    if not quiet:
        say('  $ ' + line[:160])
    t0 = time.time()
    env = dict(os.environ, PYTHONIOENCODING='utf-8', PATH=os.path.dirname(sh_exe()) + os.pathsep + os.environ.get('PATH', ''))  # the atelier's scripts call sh
    p = subprocess.Popen(argv, cwd=ctx.ch, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=env)
    try:
        out = p.communicate(timeout=timeout)[0]
        code = p.returncode
    except subprocess.TimeoutExpired:
        killtree(p)
        try:
            out = p.communicate(timeout=20)[0]
        except Exception:
            out = b''
        code = 124
    text = out.decode('utf-8', 'replace')
    open('%s/pipe-logs/%s.log' % (ctx.rc, tag), 'w', encoding='utf-8').write('$ %s\n(%d s, code %d)\n%s' % (line, time.time() - t0, code, text))
    return code, text


def have(ctx, rel):
    return os.path.exists('%s/%s' % (ctx.ch, rel))


def parse_final(text):
    """the last line of a model answer that is one JSON object"""
    for line in reversed((text or '').strip().splitlines()):
        line = line.strip().strip('`')
        if line.startswith('{') and line.endswith('}'):
            try:
                return json.loads(line)
            except Exception:
                continue
    for s in reversed(re.findall(r'\{[^{}]*\}', text or '')):
        try:
            return json.loads(s)
        except Exception:
            continue
    return None


def short(o, n=2000):
    """a log copy of a stream event: long strings (tool results, base64 images) cut"""
    if isinstance(o, dict):
        return {k: short(v, n) for k, v in o.items()}
    if isinstance(o, list):
        return [short(v, n) for v in o]
    if isinstance(o, str) and len(o) > n:
        return o[:n] + '...[%d]' % len(o)
    return o


def call_model(ctx, step, tag, model, prompt, tools, turns=None, effort='default', limit=None):
    """ONE fresh `claude -p` call: prompt on stdin, closed tool list, capped turns; its usage goes to the bill. Returns a dict
    {ok, final, text, subtype, maxturns, timeout, eq, turns, ctx_peak, denials}. Raises CapReached before the call when the cap is spent."""
    spent = ctx.bill.total()
    if spent >= ctx.cap:
        raise CapReached('cap %.2f M reached (%.2f M spent) before %s/%s' % (ctx.cap / 1e6, spent / 1e6, step, tag))
    turns = turns or TURNS[model]
    limit = limit or LIMIT[model]
    if model == 'opus':
        ramwait(ctx, '%s/%s' % (step, tag))
    ctx.beat()
    eff = EFFORT[model] if effort == 'default' else effort
    builtin = sorted({t.split('(')[0] for t in tools})
    cmd = [ctx.claude, '-p', '--model', MODELS[model], '--output-format', 'stream-json', '--verbose', '--max-turns', str(turns), '--no-session-persistence',
           '--strict-mcp-config', '--mcp-config', '{"mcpServers":{}}', '--disable-slash-commands', '--setting-sources', '', '--system-prompt', SYSTEM,
           '--tools', ','.join(builtin), '--allowedTools', *tools, '--disallowedTools', *DENY]
    if eff:
        cmd += ['--effort', eff]
    nlines = len(prompt.strip().splitlines())
    if ctx.dry:
        say('  [dry] model call %s/%s: %s effort %s, %d turns max, %d s max, tools %s, prompt %d lines %d chars' % (step, tag, MODELS[model], eff or '-', turns, limit,
            ','.join(builtin), nlines, len(prompt)))
        return {'ok': True, 'dry': True, 'final': {'status': 'dry'}, 'text': '', 'subtype': 'dry', 'maxturns': False, 'timeout': False, 'eq': 0, 'turns': 0, 'ctx_peak': 0,
                'denials': 0, 'reads': [], 'tools': []}
    n = len(glob.glob('%s/pipe-logs/*.jsonl' % ctx.rc)) + 1
    logp = '%s/pipe-logs/%02d-%s-%s.jsonl' % (ctx.rc, n, step, tag)
    t0 = time.time()
    errf = open(logp + '.err', 'wb')
    p = subprocess.Popen(cmd, cwd=ctx.ch, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=errf, env=child_env())
    st = {'result': None, 'msgs': {}, 'order': [], 'peak': 0, 'tools': []}
    log = open(logp, 'w', encoding='utf-8')

    def reader():
        for raw in p.stdout:
            try:
                o = json.loads(raw.decode('utf-8', 'replace'))
            except Exception:
                continue
            log.write(json.dumps(short(o), ensure_ascii=False) + '\n')
            t = o.get('type')
            if t == 'result':
                st['result'] = o
            elif t == 'assistant':
                m = o.get('message') or {}
                u = m.get('usage') or {}
                mid = m.get('id')
                if mid not in st['msgs']:
                    st['msgs'][mid] = {'model': m.get('model'), 'u': u, 'ch': 0}
                    st['order'].append(mid)
                st['msgs'][mid]['u'] = u
                for b in m.get('content') or []:
                    if isinstance(b, dict):
                        st['msgs'][mid]['ch'] += len(b.get('text') or '') + len(b.get('thinking') or '') + (len(json.dumps(b.get('input'))) if b.get('type') == 'tool_use' else 0)
                        if b.get('type') == 'tool_use':  # what the model opened: the checks of refs, comparaison and juge read it
                            st['tools'].append((b.get('name'), b.get('input') or {}))
                st['peak'] = max(st['peak'], (u.get('input_tokens') or 0) + (u.get('cache_creation_input_tokens') or 0) + (u.get('cache_read_input_tokens') or 0))
    th = threading.Thread(target=reader, daemon=True)
    th.start()
    try:
        p.stdin.write(prompt.encode('utf-8'))
        p.stdin.close()
    except Exception:
        pass
    timed = False
    while p.poll() is None:
        if time.time() - t0 > limit:
            timed = True
            killtree(p)
            break
        time.sleep(1)
    th.join(15)
    ctx.beat()
    log.close()
    errf.close()
    dur = time.time() - t0
    r = st['result']
    if r:
        u = r.get('usage') or {}
        row_u = {'in': u.get('input_tokens', 0), 'cw': u.get('cache_creation_input_tokens', 0), 'cr': u.get('cache_read_input_tokens', 0), 'out': u.get('output_tokens', 0)}
        mu = r.get('modelUsage') or {}
        eq = sum(Bill.eq(k, {'in': v.get('inputTokens', 0), 'cw': v.get('cacheCreationInputTokens', 0), 'cr': v.get('cacheReadInputTokens', 0), 'out': v.get('outputTokens', 0)})
                 for k, v in mu.items()) if mu else Bill.eq(model, row_u)
    else:  # no result event (killed, crashed): exact input from the messages, output estimated from what was written (3.5 characters a token)
        row_u = {'in': 0, 'cw': 0, 'cr': 0, 'out': 0}
        for mid in st['order']:
            u = st['msgs'][mid]['u']
            row_u['in'] += u.get('input_tokens', 0)
            row_u['cw'] += u.get('cache_creation_input_tokens', 0)
            row_u['cr'] += u.get('cache_read_input_tokens', 0)
            row_u['out'] += max(u.get('output_tokens', 0), int(st['msgs'][mid]['ch'] / 3.5))
        eq = Bill.eq(model, row_u)
    text = (r or {}).get('result') or ''
    sub = (r or {}).get('subtype') or ('timeout' if timed else 'no-result')
    reads = [ctx.npath(i.get('file_path') or i.get('path')) for n, i in st['tools'] if n == 'Read' and isinstance(i, dict) and (i.get('file_path') or i.get('path'))]
    ctx.reads.setdefault(step, set()).update(reads)
    cmds = [str(i.get('command') or '') for n, i in st['tools'] if n == 'Bash' and isinstance(i, dict)]
    ctx.cmds.setdefault(step, []).extend(cmds)
    out = {'ok': bool(r) and not r.get('is_error'), 'final': parse_final(text), 'text': text, 'subtype': sub, 'maxturns': sub == 'error_max_turns', 'timeout': timed,
           'eq': eq, 'turns': (r or {}).get('num_turns', len(st['order'])), 'ctx_peak': st['peak'], 'denials': len((r or {}).get('permission_denials') or []),
           'reads': reads, 'tools': [n for n, i in st['tools']], 'bash': cmds}
    ctx.bill.add(dict(row_u, step=step, tag=tag, model=model, eq=round(eq), usd=(r or {}).get('total_cost_usd'), turns=out['turns'], dur=round(dur), ctx_peak=st['peak'],
                      denials=out['denials'], ok=out['ok'], subtype=sub, ts=now(), log=os.path.basename(logp), tools=','.join(builtin), effort=eff or ''))
    say('  [%s/%s] %s %d turns, eq %.0f k, context peak %d k, %d s, %s%s' % (step, tag, model, out['turns'], eq / 1e3, st['peak'] / 1e3, dur, sub,
        ', %d denied' % out['denials'] if out['denials'] else ''))
    if not r and not timed:
        err = open(logp + '.err', 'rb').read().decode('utf-8', 'replace').strip()
        out['err'] = err[-300:]
        say('  claude: ' + err[-200:].replace('\n', ' '))
    out['capped'] = ctx.bill.total() >= ctx.cap  # the next call raises CapReached; this one's result is still used
    return out


# ---------------------------------------------------------------------------------------------------------------- helpers shared by the steps

def load_mod(ctx, name):
    p = '%s/fleur/%s.py' % (ctx.ch, name)
    spec = importlib.util.spec_from_file_location('pipe_' + name, p)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def quiet(fn, *a, **k):
    """call a function of refs.py (they print) and keep what it printed"""
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        fn(*a, **k)
    return buf.getvalue()


def server_up(port):
    import urllib.request, urllib.error
    try:
        urllib.request.urlopen('http://localhost:%d/' % port, timeout=5)
        return True
    except urllib.error.HTTPError:
        return True  # recv.py answers 501 to a GET: it is up
    except Exception:
        return False


def server_ports():
    """the servers a render needs: the atelier (FLEUR_PORT, 8805) and recv.py; never the old port (another application)"""
    return [(port(), 'the atelier server'), (8781, 'recv.py')]


def need_servers(ctx):
    if ctx.dry:
        return
    for p, what in server_ports():
        if not server_up(p):
            raise StepFailed('%s (port %d) is not running: start it (never 8765 nor 8766) and resume with --from %s' % (what, p, ctx.st.get('current')))


def ramwait(ctx, why=''):
    """fleur/res/ramwait.sh (waits for 4.5 GB of free RAM, 30 min at most) before every Opus call and every heavy render: the PC crashed"""
    rw = os.environ.get('PIPE_RAMWAIT', RAMWAIT)
    if not rw:
        return
    if ctx.dry:
        say('  [dry] ramwait.sh before %s' % why)
        return
    c, t = run_cmd(ctx, [sh_exe(), rw], 'ramwait', timeout=2400, quiet=True)
    ctx.ramwaits = getattr(ctx, 'ramwaits', 0) + 1
    if c:
        raise StepFailed('free RAM stayed low for 30 minutes before %s (%s): resume later' % (why, (t.strip().splitlines() or [''])[-1][:80]))


def private_scripts(ctx):
    """the shared shell scripts that aim at the old port get a private copy in the working copy, fleur/<name>_p.sh, with the port of
    FLEUR_PORT (the shared ones are never modified); fleur/portwrap_p.py sends the shared Python tools (fit.py) to these copies.
    Returns the names written or up to date."""
    d = ctx.ch + '/fleur'
    if not os.path.isdir(d):
        return []
    names = sorted({os.path.basename(p) for p in glob.glob(d + '/*.sh') if not p.endswith('_p.sh')})
    old = re.compile(r'localhost:%d\b' % OLD_PORT)
    pick = []
    for n in names:
        t = open('%s/%s' % (d, n), encoding='utf-8', errors='replace').read()
        live = [ln for ln in t.splitlines() if old.search(ln) and not ln.lstrip().startswith('#')]
        if n in PRIVATE or live:
            pick.append((n, t))
    done = []
    for n, t in pick:
        p = '%s/%s_p.sh' % (d, n[:-3])
        u = re.sub(r'\b%d\b' % OLD_PORT, str(port()), t)
        for m, _ in pick:  # a private script calls the private copies of the others
            u = u.replace('fleur/' + m, 'fleur/%s_p.sh' % m[:-3])
        head = '# PRIVATE COPY of fleur/%s written by fleur/pipe.py: server port %d (FLEUR_PORT). Never edit, never commit: rewritten at every run.\n' % (n, port())
        lines = u.split('\n')
        u = '\n'.join(lines[:1] + [head.rstrip('\n')] + lines[1:]) if lines and lines[0].startswith('#!') else head + u
        u = u.replace('\r\n', '\n')
        if ctx.dry:
            say('  [dry] private copy fleur/%s_p.sh (port %d)' % (n[:-3], port()))
        elif not os.path.exists(p) or open(p, encoding='utf-8', errors='replace').read() != u:
            with open(p, 'w', encoding='utf-8', newline='\n') as f:  # LF: the repositories are LF (python's 'w' writes CRLF here)
                f.write(u)
        done.append(n[:-3] + '_p.sh')
    src, dst = HERE + '/pipe/portwrap.py', d + '/portwrap_p.py'
    if os.path.exists(src) and fwd(os.path.abspath(src)) != fwd(os.path.abspath(dst)):
        if ctx.dry:
            say('  [dry] private copy fleur/portwrap_p.py')
        elif not os.path.exists(dst) or open(dst, 'rb').read() != open(src, 'rb').read():
            shutil.copyfile(src, dst)
        done.append('portwrap_p.py')
    return done


BP = 'BONNES-PRATIQUES.md'


def ensure_docs(ctx):
    """copies of the standards the models need, inside the working copy (cwd of every call): no --add-dir, no write access to the repository"""
    d = ctx.rc + '/ref'
    os.makedirs(d, exist_ok=True)
    try:
        shutil.copyfile(FC + '/docs/STANDARD-SOURCES.md', d + '/STANDARD-SOURCES.md')
        t = open(FC + '/docs/STANDARD-RENDU.md', encoding='utf-8').read()
        parts = re.split(r'(?m)^(?=#{1,3} )', t)
        keep = [p for p in parts if re.match(r'#{1,3} .*(4 bis|4 ter)', p)]
        open(d + '/STANDARD-RENDU-4bis.md', 'w', encoding='utf-8').write(''.join(keep) or t[:12000])
    except Exception as e:
        say('  standards not copied: %s' % e)
    for src in (FC + '/catalogue/serre/methode/' + BP, ctx.ch + '/catalogue/serre/methode/' + BP):  # the newest checklist: the main atelier's
        if os.path.exists(src):
            try:
                shutil.copyfile(src, d + '/' + BP)
                break
            except Exception as e:
                say('  %s not copied: %s' % (BP, e))


def bp_rel(ctx):
    return '%s/ref/%s' % (ctx.rel, BP)


def bouquet_skus(a, sid):
    """[{sku, cultivar}] from --skus "lilas~0:Ruhm von Horstenstein,..." or, read-only, from the catalogue's sources json (sku_bouquet)"""
    out = []
    for x in [s.strip() for s in (getattr(a, 'skus', '') or '').split(',') if s.strip()]:
        k, _, c = x.partition(':')
        c, _, n = c.rpartition(':') if re.search(r':\d+$', c) else (c, '', '')  # "lilas~0:Ruhm von Horstenstein:2" = 2 stems in the bouquet
        out.append({'sku': k.strip(), 'cultivar': c.strip(), 'tiges': int(n) if n else None})
    if not out:
        j = jload('%s/catalogue/serre/sources/%s.json' % (FC, sid), {})
        sb = j.get('sku_bouquet')
        for x in ([sb] if isinstance(sb, dict) and 'sku' in sb else sb if isinstance(sb, list) else []):
            out.append({'sku': x.get('sku'), 'cultivar': x.get('cultivar') or '', 'tiges': x.get('tiges')})
    return out


# ---------------------------------------------------------------------------------------------------------------- census

def cult_name(c):
    return c.get('nom') or c.get('name') or c.get('cultivar') or c.get('nom_enregistre') or ''


def census_table(ctx):
    """the cultivars of census.json with the Haiku verdicts merged: [{nom, niveau, marque (libre|a_verifier|deposee), photos, ...}]"""
    d = ctx.rc + '/census'
    cen = jload(d + '/census.json', {})
    V = {}
    for f in sorted(glob.glob(d + '/verdict-*.json')):
        for v in jload(f, []) or []:
            if isinstance(v, dict) and v.get('nom'):
                V[norm(v['nom'])] = v
    out = []
    for c in cen.get('cultivars', []) or []:
        n = cult_name(c)
        v = V.get(norm(n)) or V.get(norm(c.get('cle', ''))) or {}
        lvl = str(v.get('niveau') or c.get('niveau_provisoire') or c.get('niveau') or 'D').strip().upper()[:1]
        mq = c.get('marque')
        hint = bool(mq.get('indice')) if isinstance(mq, dict) else bool(mq)
        br = str(v.get('marque') or c.get('marque_verdict') or ('a_verifier' if hint else 'libre')).lower()
        br = 'deposee' if br.startswith('dep') else 'a_verifier' if br.startswith('a_') or br.startswith('à') else 'libre'
        syn = c.get('synonymes') or []
        out.append({'nom': n, 'niveau': lvl if lvl in 'ABCD' else 'D', 'marque': br, 'photos': c.get('photos') or [], 'verdict': bool(v),
                    'names': [norm(n)] + [norm(s) for s in (syn if isinstance(syn, list) else str(syn).split(','))], 'groupe': c.get('groupe'), 'cid': c.get('cid')})
    return out


def set_questions(ctx, key, title, lines):
    """refcache/<sid>/questions.md: the open questions of the sort, by section (never blocking); questions.json keeps the sections"""
    if ctx.dry:
        return
    p = ctx.rc + '/questions.json'
    Q = jload(p, {}) or {}
    if lines:
        Q[key] = {'title': title, 'lines': lines, 't': now()}
    else:
        Q.pop(key, None)
    jsave(p, Q)
    L = ['# Questions ouvertes de %s' % ctx.sid, '', 'Écrites par pipe.py ; aucune ne bloque la sorte. Une réponse du porteur se reporte dans les sources, puis `run %s --from <étape>`.' % ctx.sid]
    for k, q in Q.items():
        L += ['', '## ' + q['title'], ''] + ['- ' + x for x in q['lines']]
    open(ctx.rc + '/questions.md', 'w', encoding='utf-8', newline='\n').write('\n'.join(L) + '\n')


TRADE_SKIP = {'wikidata', 'wikimedia commons', 'commons', 'inaturalist', 'gbif', 'kavb'}  # not trade lists


def catalogue_names(ctx):
    """the names of the catalogue's colourways of the sort (read-only: catalogue/serre/sources/<sid>.json) and of the bouquet SKUs"""
    out = {norm(x.get('cultivar')) for x in ctx.st.get('skus', []) if x.get('cultivar')}
    for f in ('%s/catalogue/serre/sources/%s.json' % (FC, ctx.sid), '%s/catalogue/serre/sources/%s-coloris.json' % (FC, ctx.sid)):
        j = jload(f, {}) or {}
        cw = j.get('coloris') or []
        for c in (cw.values() if isinstance(cw, dict) else cw):
            if not isinstance(c, dict):
                continue
            for k in ('nom_enregistre', 'nom', 'cultivar', 'nom_libre', 'cle_inventaire', 'nom_variete'):
                if isinstance(c.get(k), str):
                    out.add(norm(c[k]))
            for x in (c.get('cultivars_retenus') or []) + (c.get('photos') or []):
                if isinstance(x, dict):
                    for k in ('nom', 'nom_variete'):
                        if isinstance(x.get(k), str):
                            out.add(norm(x[k]))
    return {n for n in out if n}


def census_relevant(c, cat):
    """the light census (owner, 2026-10-17): Haiku proofs only for the catalogue's colourways and the colourways that trade lists document;
    the hundreds of register cultivars without a photo are left as they are"""
    names = [norm(cult_name(c))] + [norm(s) for s in (c.get('synonymes') if isinstance(c.get('synonymes'), list) else str(c.get('synonymes') or '').split(','))]
    names = [n for n in names if n]
    if any(n in cat or any(len(k) > 3 and (k in n or n in k) for k in cat) for n in names):
        return 'catalogue'
    for p in (c.get('preuves') or []) + (c.get('photos') or []):
        if isinstance(p, dict) and str(p.get('niveau') or '').upper() in ('N2', 'N3') and not p.get('registre') and norm(p.get('source')) not in TRADE_SKIP:
            return 'negoce'
    return None


def census_lot(ctx, b):
    """the lot sent to Haiku for one doubtful batch of census.py: only its relevant cultivars (lot-<n>.json); an empty lot is settled as is"""
    n = re.findall(r'\d+', os.path.basename(b))[0]
    cat = catalogue_names(ctx)
    raw = jload(b, []) or []
    keep = [dict(c, pertinence=census_relevant(c, cat)) for c in raw if isinstance(c, dict) and census_relevant(c, cat)]
    lot = '%s/census/lot-%s.json' % (ctx.rc, n)
    jsave(lot, keep)
    if not keep:
        jsave(b.replace('douteux-', 'verdict-'), [])
    return lot, len(keep), len(raw) - len(keep)


IMG_KEYS = ('image', 'img', 'url_image', 'thumb', 'url')
IMG_SKIP = re.compile(r'variante|appoint|ecart|exclu|rejet|hors', re.I)  # photos of another variety or set aside: never a colourway's measure


def import_photos(o):
    """the named photos of a colourway of a sources file, wherever the wave put them (photos[], cultivars_retenus[].photos_a_mesurer[],
    sources[].fichiers[], mesures.photos_retenues[]...): every object with an image URL, outside the branches of other varieties"""
    if isinstance(o, list):
        for v in o:
            yield from import_photos(v)
    elif isinstance(o, dict):
        img = next((o[k] for k in IMG_KEYS if isinstance(o.get(k), str) and o[k].startswith('http') and re.search(r'\.(jpe?g|png|webp)(\?|$)', o[k], re.I)), None)
        if img:
            yield {'img': img, 'page': o.get('page') or o.get('url_page') or o.get('page_url') or img, 'niveau': o.get('niveau_source') or o.get('niveau') or 'N4'}
        for k, v in o.items():
            if isinstance(v, (dict, list)) and not IMG_SKIP.search(k):
                yield from import_photos(v)


def census_import(ctx):
    """--skip-census without refcache/<sid>/census/census.json: the census already made (catalogue/serre/sources/<sid>.json, read-only) becomes
    census.json, with loose aliases (the files of waves 1 to 3 differ); the colourway ids are kept (cid) so that coloris.json keeps them"""
    d = ctx.rc + '/census'
    if os.path.exists(d + '/census.json'):
        return 'census.json already there'
    src = next((f for f in ('%s/catalogue/serre/sources/%s.json' % (FC, ctx.sid), '%s/catalogue/serre/sources/%s-coloris.json' % (FC, ctx.sid)) if os.path.exists(f)), None)
    j = jload(src, {}) if src else {}
    cw = (j or {}).get('coloris') or []
    cw = list(cw.values()) if isinstance(cw, dict) else cw
    if not cw:
        raise StepFailed('--skip-census: no refcache/%s/census/census.json and no colourways in catalogue/serre/sources/%s.json' % (ctx.sid, ctx.sid))
    out = []
    for c in cw:
        if not isinstance(c, dict):
            continue
        ret = c.get('cultivars_retenus') or []
        r0 = ret[0] if ret and isinstance(ret[0], dict) else {}
        nom = next((x for x in (c.get('nom_enregistre'), c.get('nom'), c.get('cultivar'), c.get('nom_libre'), r0.get('nom'), c.get('nom_affiche'), str(c.get('id') or ''))
                    if isinstance(x, str) and x.strip()), '')
        ph, seen = [], set()
        for x in import_photos(c):
            if x['img'] not in seen:
                seen.add(x['img'])
                ph.append(x)
        lvl = next((str(x).strip().upper()[:1] for x in (c.get('niveau_retenu'), c.get('niveau'), r0.get('niveau'), c.get('niveau_preuve'), c.get('niveau_provisoire')) if x), '')
        lvl = lvl if lvl in 'ABCD' and lvl else ('C' if ph else 'D')
        mq = c.get('marque') if c.get('marque') is not None else r0.get('marque')
        stt = norm(mq.get('statut') if isinstance(mq, dict) else mq if isinstance(mq, str) else '')
        br = 'deposee' if stt.startswith('depos') else 'a_verifier' if stt.startswith('a verifier') or '®' in str(mq if isinstance(mq, str) else '') else 'libre'
        out.append({'nom': nom, 'cid': str(c['id']) if c.get('id') is not None else None, 'niveau_provisoire': lvl, 'photos': ph,
                    'marque': {'indice': br != 'libre', 'statut_source': stt} if br != 'libre' else None, 'marque_verdict': br, 'synonymes': c.get('synonymes') or []})
    jsave(d + '/census.json', {'sid': ctx.sid, 'importe_de': fwd(os.path.relpath(src, FC)), 'importe_le': now(), 'cultivars': out})
    return 'imported %d colourways from %s' % (len(out), fwd(os.path.relpath(src, FC)))


def sku_cultivar(rows, cname):
    k = norm(cname)
    if not k:
        return None
    hit = [r for r in rows if k in r['names']] or [r for r in rows if any(k in n or (n and n in k) for n in r['names'])]
    return sorted(hit, key=lambda r: 'AB'.find(r['niveau']) if r['niveau'] in 'AB' else 9)[0] if hit else None


OK_LEVELS = 'ABC'  # owner, 2026-10-17: a colourway is validated up to level C (named photos and a referenced colourway); only D is a question


def check_census(ctx):
    """a cultivar at A, B or C per bouquet SKU, free of brand; a SKU at D, not found or under a brand is a question (questions.md), never a block: a brand keeps a
    generic colour name (BONNES-PRATIQUES 4.9), never the brand's name"""
    rows = census_table(ctx)
    if not rows:
        return {'ok': False, 'msg': 'census.json missing or without cultivars'}
    lv = {k: sum(1 for r in rows if r['niveau'] == k) for k in 'ABCD'}
    good = [r for r in rows if r['niveau'] in OK_LEVELS and r['marque'] == 'libre']
    waiting = [r['nom'] for r in rows if r['marque'] == 'a_verifier']
    if waiting and not ctx.dry:
        open(ctx.rc + '/marques-a-verifier.txt', 'w', encoding='utf-8').write('\n'.join(waiting) + '\n')
    bad, unresolved, dsku = [], [], []
    for x in ctx.st.get('skus', []):
        r = sku_cultivar(rows, x.get('cultivar'))
        if r is None:
            unresolved.append(x['sku'])
        elif r['niveau'] == 'D':
            dsku.append('%s (%s)' % (x['sku'], r['nom']))
        elif r['marque'] != 'libre':
            bad.append('%s (%s: level %s, brand %s)' % (x['sku'], r['nom'], r['niveau'], r['marque']))
    q = ['SKU %s : cultivar au niveau D (aucune photo nommée trouvée). Proposition : garder la couleur actuelle du catalogue, chercher une photo nommée '
         '(obtenteur, producteur) ; le niveau C suffit.' % s for s in dsku]
    q += ['SKU %s : son cultivar ne figure pas au recensement. Proposition : vérifier le nom (synonyme, orthographe) dans les sources de la sorte.' % s for s in unresolved]
    q += ['SKU %s : cultivar sous marque à vérifier. Proposition : nom de couleur générique (jamais le nom de marque), ou `ret:1` si le porteur le '
          'préfère.' % s for s in bad]
    set_questions(ctx, 'census', 'Recensement : coloris du bouquet au niveau D, introuvables ou sous marque (non bloquant)', q)
    ok = bool(rows)
    msg = '%d cultivars, A %d B %d C %d D %d, %d A/B/C free of brand, %d brand to check' % (len(rows), lv['A'], lv['B'], lv['C'], lv['D'], len(good), len(waiting))
    if bad:
        msg += '; bouquet SKU under a brand (generic name, question): ' + ', '.join(bad)
    if dsku or unresolved:
        msg += '; questions (questions.md): %d SKU at D, %d SKU not found' % (len(dsku), len(unresolved))
    return {'ok': ok, 'msg': msg, 'levels': lv, 'good': len(good), 'd_skus': dsku, 'unresolved': unresolved}


def step_census(ctx):
    d = ctx.rc + '/census'
    os.makedirs(d, exist_ok=True)
    if not have(ctx, 'fleur/census.py'):
        return {'status': 'skipped', 'msg': 'fleur/census.py not delivered yet'}
    ensure_docs(ctx)
    if not os.path.exists(d + '/census.json') or ctx.st.get('force_census'):
        a = ctx.a
        cmd = [sys.executable, 'fleur/census.py', ctx.sid, '--taxon', ctx.taxon, '--out', ctx.rel + '/census']
        if ctx.st.get('genus'):
            cmd += ['--genus', ctx.st['genus']]
        if ctx.st.get('group'):
            cmd += ['--group', ctx.st['group']]
        if ctx.st.get('kavb'):
            cmd += ['--kavb']
        if getattr(a, 'max', None):
            cmd += ['--max', str(a.max)]
        code, text = run_cmd(ctx, cmd, 'census', timeout=3600)
        if not ctx.dry and (code not in (0,) or not os.path.exists(d + '/census.json')):
            raise StepFailed('census.py code %d: %s' % (code, text.strip().splitlines()[-1] if text.strip() else ''))
    batches = sorted(glob.glob(d + '/douteux-*.json'), key=lambda p: int(re.findall(r'\d+', os.path.basename(p))[0]))
    batches = [b for b in batches if not os.path.basename(b).startswith('douteux-900')]
    todo, skipped = [], 0
    for b in batches:
        if os.path.exists(b.replace('douteux-', 'verdict-')):
            continue
        if ctx.dry:
            todo.append(b)
            continue
        lot, n_in, n_out = census_lot(ctx, b)
        skipped += n_out
        if n_in:
            todo.append(lot)
    say('  %d doubtful batches, %d lots to settle with Haiku (catalogue and trade colourways only; %d register cultivars left as they are)' % (len(batches), len(todo), skipped))

    def one(b):
        n = re.findall(r'\d+', os.path.basename(b))[0]
        for k in (1, 2):  # a second pass finishes a batch cut by the turn cap
            p = prompt_text('census', **ctx.sub(n=n, batch='%s/census/%s' % (ctx.rel, os.path.basename(b)), verdict='%s/census/verdict-%s.json' % (ctx.rel, n)))
            r = call_model(ctx, 'census', 'lot%s.%d' % (n, k), 'haiku', p, READ + ['Write'] + WEB + ['Bash(python *)', 'Bash(ls *)', 'Bash(head *)', 'Bash(tail *)', 'Bash(cat *)', 'Bash(wc *)'], turns=60)
            if (r.get('final') or {}).get('status') == 'done' or ctx.dry:
                return
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=min(3, max(1, len(todo)))) as ex:
        futs = [ex.submit(one, b) for b in todo]
        for f in futs:
            f.result()
    c = check_census(ctx)
    if c.get('d_skus') and not os.path.exists(d + '/verdict-900.json'):
        # the bouquet's cultivars at D get one targeted Haiku search for a named photo (lot 900; level C is enough), then the check again
        raw = {norm(x.get('nom', '')): x for x in jload(d + '/census.json', {}).get('cultivars', [])}
        lot = []
        for x in ctx.st.get('skus', []):
            k = norm(x.get('cultivar') or '')
            r = raw.get(k) or next((v for n, v in raw.items() if k and n and (n in k or k in n)), None)  # same loose match as sku_cultivar
            rr = sku_cultivar(census_table(ctx), x.get('cultivar'))
            if r is not None and rr is not None and rr['niveau'] == 'D':
                lot.append(dict(r, consigne='SKU du bouquet %s au niveau D : cherche par WebSearch ciblée UNE photo nommée de ce cultivar (obtenteur, producteur, '
                                         'exportateur, jardin botanique, société du genre) ; le niveau C suffit, ne cherche pas au-delà. Donne l\'URL de l\'image. '
                                         'Si rien ne se trouve, dis-le.' % x['sku']))
        if lot:
            say('  bouquet cultivars at D: one targeted search (lot 900)')
            jsave(d + '/douteux-900.json', lot)
            one(d + '/douteux-900.json')
            c = check_census(ctx)
    return {'status': 'done' if c['ok'] else 'failed', 'msg': c['msg'], 'checks': c}


# ---------------------------------------------------------------------------------------------------------------- refs

def norm_tag(t):
    t = norm(t.split(':', 1)[-1]).replace(' ', '-')
    return {'fanee': 'fane', 'fanes': 'fane', 'faner': 'fane', 'withered': 'fane', 'trois-quart': 'trois-quarts', '3-4': 'trois-quarts', 'entrouverte': 'entrouvert',
            'ouverte': 'ouvert', 'declin': 'declin', 'feuille-fane': 'feuille-fanee', 'feuilles-fanees': 'feuille-fanee', 'feuille': 'feuille-dessus', 'feuilles': 'feuille-dessus',
            'attache': 'feuille-dessus', 'bud': 'bouton'}.get(t, t)


REFS_MIN = {  # tag family -> {value: soft minimum}; hard minimum below
    'stade': {'bouton': 2, 'entrouvert': 2, 'ouvert': 3, 'declin': 1, 'fane': 2},
    'vue': {'face': 2, 'profil': 2, 'trois-quarts': 1, 'dos': 1},
    'organe': {'feuille-dessus': 2, 'feuille-dessous': 1, 'tige': 2, 'bourgeon': 1, 'feuille-fanee': 1, 'plante': 1}}
REFS_HARD = [('stade', 'bouton'), ('stade', 'ouvert'), ('stade', 'fane'), ('organe', 'feuille-dessus'), ('organe', 'tige'),
             ('vue', 'face'), ('vue', 'trois-quarts'), ('vue', 'profil')]  # the views of the comparison pairs (BONNES-PRATIQUES 9.3b)
VU_RE = re.compile(r'\bvu\s*:\s*([^;]*)', re.I)
VU_KV = re.compile(r'(stade|vue|organe|groupe)\s*=\s*([^\s;,=]+)', re.I)
# P7: what the photo shows, as a group (BONNES-PRATIQUES 1.3, 1.7): a cut-flower hybrid, the wild species, a garden form, or something else
GROUPES = ('hybride-de-coupe', 'espece-sauvage', 'jardin', 'autre')
GROUPE_ALIAS = {'hybride': 'hybride-de-coupe', 'coupe': 'hybride-de-coupe', 'hybride-coupe': 'hybride-de-coupe', 'fleur-coupee': 'hybride-de-coupe',
                'cultivar': 'hybride-de-coupe', 'sauvage': 'espece-sauvage', 'espece': 'espece-sauvage', 'wild': 'espece-sauvage', 'garden': 'jardin'}
PAIR_GROUPES = 'hybride-de-coupe,jardin'  # the groups a comparison photo may show (--groupes; never "autre")
PAIR_SHORT = 1000                         # a comparison photo's short side in px at least (P7): its local copy p<NNN>.jpg
PAIR_LONG = 2400                          # ... downloaded at its original size, its long side brought down to this
CW_DE_MAX = 15                            # a coloris:<x> photo whose flower is further than this (CIE76) from the colourway's colour leaves the pairs
CW_CONF_MIN = .5                          # ... when refs.py auto found the flower with this confidence at least (as the coloris step); below: no verdict


def vu_parse(m):
    """the "vu" field of a kept photo (refs.py keep --m "vu: stade=ouvert+declin vue=profil organe=tige groupe=hybride-de-coupe ; note"): what was
    SEEN on the image"""
    mm = VU_RE.search(m or '')
    if not mm:
        return None
    out = {}
    for k, v in VU_KV.findall(mm.group(1)):
        fam = k.lower()
        vals = [norm_tag(x) for x in v.split('+') if norm(x) and norm(x) not in ('aucun', 'aucune', 'na')]
        vals = ['bourgeon' if fam == 'organe' and x == 'bouton' else x for x in vals]
        if fam == 'groupe':
            vals = [GROUPE_ALIAS.get(x, x) for x in vals]
        out.setdefault(fam, []).extend(vals)
    return out if any(out.values()) else None


def photo_groupe(x):
    """the group the "vu" field of a kept photo states (P7), or None"""
    g = (vu_parse(x.get('m')) or {}).get('groupe') or []
    return g[0] if g and g[0] in GROUPES else None


def pair_groupes(ctx):
    return [g for g in (ctx.st.get('groupes') or PAIR_GROUPES).split(',') if g in GROUPES and g != 'autre']


def pair_photo(ctx, R, x, info):
    """P7: the local copy of a kept photo for the comparison pairs, refcache/<sid>/p<NNN>.jpg, at its original size (long side <= PAIR_LONG);
    its size goes to info[i] = {w, h, short, file}. A Commons thumbnail URL asks the width of the original (cands.json w); an original known to be
    small is not downloaded. Network errors are noted, never raised."""
    i = int(x.get('i', -1))
    key = str(i)
    if key in info and (info[key].get('file') or info[key].get('err') or info[key].get('short')):
        return info[key]
    C = jload(ctx.rc + '/cands.json', []) or []
    c = C[i] if 0 <= i < len(C) else {}
    url, ow, oh = c.get('thumb') or '', int(c.get('w') or 0), int(c.get('h') or 0)
    rec = {'src': url}
    if ow and oh and min(ow, oh) < PAIR_SHORT:
        rec.update(w=ow, h=oh, short=min(ow, oh), err='original %dx%d' % (ow, oh))
        info[key] = rec
        return rec
    if ow and re.search(r'/thumb/.*/\d+px-', url):
        url = re.sub(r'/(\d+)px-', '/%dpx-' % min(ow, 2 * PAIR_LONG), url)
    p = '%s/p%03d.jpg' % (ctx.rc, i)
    try:
        from PIL import Image
        if not os.path.exists(p):
            im = Image.open(io.BytesIO(R.get(url))).convert('RGB')
            im.thumbnail((PAIR_LONG, PAIR_LONG))
            im.save(p, quality=90)
        w, h = Image.open(p).size
        rec.update(w=w, h=h, short=min(w, h), file='%s/p%03d.jpg' % (ctx.rel, i))
    except Exception as e:
        rec['err'] = 'download: %s' % str(e)[:80]
    info[key] = rec
    return rec


def pair_photos(ctx, R=None):
    """the sizes of the kept photos' pair copies (pair-photos.json), fetched for the photos a pair may use (tags of PAIRS, coloris:)"""
    p = ctx.rc + '/pair-photos.json'
    info = jload(p, {}) or {}
    if ctx.dry:
        return info
    want = {t for P in PAIRS for alt in P['want'] for t in alt}
    K = jload(ctx.rc + '/keep.json', []) or []
    todo = [x for x in K if (kept_tags(x) & want or photo_cws(x)) and str(x.get('i')) not in info]
    if todo:
        R = R or load_mod(ctx, 'refs')
        for x in todo:
            pair_photo(ctx, R, x, info)
        jsave(p, info)
    return info


def pair_eligible(ctx, x, info):
    """(ok, why) a kept photo may face a render in a pair: its group is one the sort compares to (--groupes), its copy is >= PAIR_SHORT px"""
    g, why = photo_groupe(x), []
    if g is None:
        why.append('no groupe= in its "vu" field')
    elif g not in pair_groupes(ctx):
        why.append('groupe %s' % g)
    r = info.get(str(x.get('i'))) or {}
    if not r.get('short'):
        why.append('size unknown (%s)' % (r.get('err') or 'no pair copy'))
    elif r['short'] < PAIR_SHORT or not r.get('file'):
        why.append('short side %d px (< %d)' % (r['short'], PAIR_SHORT) if r['short'] < PAIR_SHORT else (r.get('err') or 'no pair copy'))
    return (not why), ', '.join(why)


def cw_hexes(ctx):
    """{normalised colourway name: (hex, where from)}: the measured body colour of coloris.json (after the coloris step), else the colour of the
    catalogue's sources file (read-only)"""
    out = {}
    for e in jload(ctx.rc + '/coloris.json', []) or []:
        if re.match(r'^#[0-9a-fA-F]{6}$', str(e.get('corps') or '')):
            for n in cw_names(e):
                out[n] = (e['corps'], 'coloris.json')
    if out:
        return out
    j = jload('%s/catalogue/serre/sources/%s.json' % (FC, ctx.sid), {}) or {}
    cw = j.get('coloris') or []
    for c in (cw.values() if isinstance(cw, dict) else cw):
        if not isinstance(c, dict):
            continue
        ms = c.get('mesures') if isinstance(c.get('mesures'), dict) else {}
        hx = next((v for v in (ms.get('corps'), ms.get('corps_hex'), ms.get('mediane_corps'), c.get('couleur_catalogue'), c.get('teinte_catalogue'), c.get('couleur_sku'),
                               ms.get('catalogue_hex')) if isinstance(v, str) and re.match(r'^#[0-9a-fA-F]{6}$', v)), None)
        if hx:
            for k in ('id', 'nom', 'nom_enregistre', 'cultivar', 'nom_libre'):
                if c.get(k) is not None and norm(str(c[k])):
                    out[norm(str(c[k]))] = (hx, 'catalogue')
    return out


def cw_photo_audit(ctx, R=None):
    """P7: every kept photo tagged coloris:<x>: the median of its flower (refs.py auto, body ring) against the colour of <x>; CIE76 above CW_DE_MAX:
    the photo leaves the pairs of that colourway and is reported (questions.md). coloris-photos.json: {i: {cw, hex, src, corps, conf, dE, ok}}"""
    p = ctx.rc + '/coloris-photos.json'
    old = jload(p, {}) or {}
    K = [x for x in jload(ctx.rc + '/keep.json', []) or [] if photo_cws(x)]
    if ctx.dry:
        say('  [dry] colour audit of the %d kept photos tagged coloris: (refs.py auto, dE > %d leaves the pairs)' % (len(K), CW_DE_MAX))
        return old
    hexes, out, rep = cw_hexes(ctx), {}, []
    for x in K:
        i = str(x.get('i'))
        meas = old.get(i) if old.get(i, {}).get('corps') else None
        if not meas:
            try:
                R = R or load_mod(ctx, 'refs')
                m = AUTO_RE.search(quiet(R.auto, ctx.sid, int(x['i'])))
                meas = {'corps': m[2], 'conf': float(m[4])} if m else {'err': 'no auto measure'}
            except Exception as e:
                meas = {'err': str(e)[:80]}
        for n in sorted(photo_cws(x)):
            hx = hexes.get(n)
            r = dict(cw=n, corps=meas.get('corps'), conf=meas.get('conf'), err=meas.get('err'))
            if not hx:
                r.update(ok=None, why='no colour known for %s yet' % n)
            elif not meas.get('corps'):
                r.update(hex=hx[0], src=hx[1], ok=None, why=meas.get('err'))
            elif (meas.get('conf') or 0) < CW_CONF_MIN:  # refs.py auto did not find the flower surely (busy background): no verdict, said
                r.update(hex=hx[0], src=hx[1], dE=round(delta_e(meas['corps'], hx[0]), 1), ok=None, why='auto measure unsure (confidence %.2f)' % meas['conf'])
            else:
                de = round(delta_e(meas['corps'], hx[0]), 1)
                r.update(hex=hx[0], src=hx[1], dE=de, ok=de <= CW_DE_MAX)
                if de > CW_DE_MAX:
                    rep.append('photo %s (coloris:%s) : fleur %s contre %s (%s), ΔE %.0f > %d : écartée des paires de ce coloris. Proposition : vérifier la variété de la photo '
                               '(ou la couleur du coloris), ou la remplacer à refs.' % (i, n, meas['corps'], hx[0], hx[1], de, CW_DE_MAX))
            out.setdefault(i, {})[n] = r
    jsave(p, out)
    set_questions(ctx, 'photos-coloris', 'Photos balisées coloris: trop loin de la couleur du coloris (refs, P7)', rep)
    return out


def cw_photo_ok(audit, x, name):
    """False when the colour audit put photo x out of the pairs of colourway `name` (unknown stays usable)"""
    return (audit.get(str(x.get('i'))) or {}).get(name, {}).get('ok') is not False


def refs_seen(ctx):
    """the thumbnails and contact sheets the refs calls opened (refs-vus.json: kept across calls and resumptions)"""
    p = ctx.rc + '/refs-vus.json'
    seen = set(jload(p, []) or [])
    rc = ctx.npath(ctx.rel)
    for f in ctx.reads.get('refs', set()):
        if f.startswith(rc):
            seen.add(os.path.basename(f))
    if not ctx.dry:
        jsave(p, sorted(seen))
    return seen


def refs_audit(ctx):
    """a kept photo stays only if a refs call LOOKED at it (its thumbnail t<NNN>.jpg or the contact sheet that holds it was opened with Read)
    and its "vu" field states the stage / view / organ seen, agreeing with its tags; the others leave keep.json (keep-ecartes.json says why)"""
    K = jload(ctx.rc + '/keep.json', []) or []
    seen = refs_seen(ctx)
    sheets = [int(m) for s in seen for m in re.findall(r'^sheet_(\d+)\.jpg$', s)]
    good, bad = [], []
    for x in K:
        i = int(x.get('i', -1))
        looked = 't%03d.jpg' % i in seen or any(f <= i < f + 20 for f in sheets)
        vu = vu_parse(x.get('m'))
        why = []
        if not looked:
            why.append('not looked at (neither its thumbnail nor its sheet was opened)')
        if not vu:
            why.append('no "vu:" field (stage, view, organ seen)')
        else:
            for t in x.get('tags', []):
                fam, _, v = t.partition(':')
                fam = fam.strip().lower()
                if fam in ('stade', 'vue', 'organe'):
                    v = norm_tag(v)
                    v = 'bourgeon' if fam == 'organe' and v == 'bouton' else v
                    if v not in vu.get(fam, []):
                        why.append('tag %s not in its "vu" field' % t)
        (bad if why else good).append(dict(x, raison='; '.join(why)) if why else x)
    if bad and not ctx.dry:
        old = jload(ctx.rc + '/keep-ecartes.json', []) or []
        jsave(ctx.rc + '/keep-ecartes.json', old + [dict(b, ecarte=now()) for b in bad])
        jsave(ctx.rc + '/keep.json', good)
    return len(good), bad


def refs_counts(ctx):
    K = jload(ctx.rc + '/keep.json', [])
    c = {fam: {} for fam in REFS_MIN}
    for x in K:
        for t in x.get('tags', []):
            if ':' not in t:
                continue
            fam, _, v = t.partition(':')
            fam = fam.strip().lower()
            if fam in c:
                v = norm_tag(v)
                v = 'bourgeon' if fam == 'organe' and v == 'bouton' else v
                c[fam][v] = c[fam].get(v, 0) + 1
    return len(K), c


def check_refs(ctx):
    n, c = refs_counts(ctx)
    n_org = sum(c['organe'].values())
    soft = ['%s:%s %d/%d' % (f, v, c[f].get(v, 0), m) for f, d in REFS_MIN.items() for v, m in d.items() if c[f].get(v, 0) < m]
    hard = ['%s:%s' % (f, v) for f, v in REFS_HARD if c[f].get(v, 0) < 1]
    if n < 10:
        hard.append('only %d photos kept (10 at least)' % n)
    if n_org < 10:
        soft.append('organs %d/10' % n_org)
    return {'ok': not hard, 'n': n, 'organs': n_org, 'hard': hard, 'soft': soft,
            'msg': '%d photos, %d organs; missing for good: %s; short: %s' % (n, n_org, ', '.join(hard) or '-', ', '.join(soft[:8]) or '-')}


def refs_find(ctx, R):
    """the deterministic searches: the taxon category, then targeted queries (stages, organs, the cultivars of the bouquet)"""
    tx = ctx.taxon
    qs = ['Category:' + tx, tx + ' bud', tx + ' flower close-up', tx + ' wilted faded withered', tx + ' leaf', tx + ' leaves underside', tx + ' stem',
          tx + ' side view', tx + ' cut flowers vase']
    for x in ctx.st.get('skus', []):
        if x.get('cultivar'):
            qs.append("%s '%s'" % (ctx.genus, x['cultivar']))
    for q in qs:
        for k in range(3):
            try:
                say('  find: ' + quiet(R.find, ctx.sid, q, 80 if q.startswith('Category:') else 25, 1).strip()[:100])
                break
            except Exception as e:
                if '429' in str(e) and k < 2:
                    say('  Commons 429, waiting 60 s')
                    time.sleep(60)
                else:
                    say('  find failed (%s): %s' % (q, str(e)[:80]))
                    break
        time.sleep(1)


def refs_sheets(ctx, R):
    n = len(jload(ctx.rc + '/cands.json', []))
    out = []
    for f in range(0, n, 20):
        quiet(R.sheet, ctx.sid, f, 20, 200)
        out.append('%s/sheet_%d.jpg' % (ctx.rel, f))
    return out


def step_refs(ctx):
    ensure_docs(ctx)
    if ctx.dry:
        R = None
        say('  [dry] refs.py find (taxon category + %d targeted queries), sheets by 20, then Haiku pick / fill / brief' % (9 + len(ctx.st.get('skus', []))))
    else:
        R = load_mod(ctx, 'refs')
        if len(jload(ctx.rc + '/cands.json', [])) < 40:
            refs_find(ctx, R)
        sheets = refs_sheets(ctx, R)
    tools = READ + ['Bash(python *)', 'Bash(ls *)', 'Bash(head *)', 'Bash(tail *)', 'Bash(wc *)', 'Bash(cat *)']
    keep_before = json.dumps([x.get('title') for x in jload(ctx.rc + '/keep.json', []) or []])
    n0, bad0 = refs_audit(ctx)  # photos kept blind by an earlier run (no "vu", never opened) leave first
    if bad0:
        say('  %d kept photos set aside (never looked at or without "vu"): keep-ecartes.json' % len(bad0))
    dropped = len(bad0)
    if not jload(ctx.rc + '/keep.json', []) or ctx.dry:
        sh = '' if ctx.dry else '\n'.join('- ' + s for s in sheets)
        r = call_model(ctx, 'refs', 'pick', 'sonnet', prompt_text('refs', **ctx.sub(task='pick', sheets=sh or '-', missing='-', groupes=', '.join(pair_groupes(ctx)))), tools, turns=60)
        n1, bad = refs_audit(ctx)
        dropped += len(bad)
    c = check_refs(ctx)
    if not c['ok'] or len(c['soft']) > 3:
        miss = ', '.join(c['hard'] + c['soft'])
        r = call_model(ctx, 'refs', 'fill', 'sonnet', prompt_text('refs', **ctx.sub(task='fill', sheets='-', missing=miss or '-', groupes=', '.join(pair_groupes(ctx)))), tools + WEB + ['Write'], turns=60)
        n2, bad = refs_audit(ctx)
        dropped += len(bad)
        c = check_refs(ctx)
    if not ctx.dry and c['n']:
        quiet(R.kept, ctx.sid, 220)
    changed = json.dumps([x.get('title') for x in jload(ctx.rc + '/keep.json', []) or []]) != keep_before
    if not os.path.exists(ctx.rc + '/brief.md') or changed or ctx.dry:  # the brief follows the photos actually kept
        call_model(ctx, 'refs', 'brief', 'haiku', prompt_text('brief', **ctx.sub()), tools + ['Write'], turns=30)
    if not ctx.dry and not os.path.exists(ctx.rc + '/brief.md'):
        c['ok'], c['msg'] = False, c['msg'] + '; brief.md not written'
    c['set_aside'] = dropped
    c['msg'] += '; %d photos set aside by the "looked at" check' % dropped
    c['msg'] += '; ' + refs_pair_audit(ctx, R)
    return {'status': 'done' if c['ok'] else 'failed', 'msg': c['msg'], 'checks': c, 'gaps': c['soft']}


def refs_pair_audit(ctx, R=None):
    """P7 at refs: the pair copies of the kept photos (>= PAIR_SHORT px), the colour audit of the coloris: photos, the photos without groupe="""
    if ctx.dry:
        cw_photo_audit(ctx)
        return 'dry: pair copies (>= %d px) and colour audit of the coloris: photos' % PAIR_SHORT
    K = jload(ctx.rc + '/keep.json', []) or []
    info = pair_photos(ctx, R)
    big = sum(1 for r in info.values() if (r.get('short') or 0) >= PAIR_SHORT and r.get('file'))
    audit = cw_photo_audit(ctx, R)
    off = sorted({i for i, d in audit.items() for r in d.values() if r.get('ok') is False})
    nog = [str(x.get('i')) for x in K if photo_groupe(x) is None]
    return 'pair copies of %d px or more: %d of %d; colour audit: %d coloris: photo(s) out of the pairs%s; %d kept photo(s) without groupe=%s' % (
        PAIR_SHORT, big, len(info), len(off), (' (%s)' % ', '.join(off)) if off else '', len(nog), (' (%s)' % ', '.join(nog[:8])) if nog else '')


# ---------------------------------------------------------------------------------------------------------------- coloris

def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb_lab(c):
    def f(u):
        u /= 255.0
        u = u / 12.92 if u <= .04045 else ((u + .055) / 1.055) ** 2.4
        return u
    r, g, b = (f(x) for x in c)
    X, Y, Z = (.4124 * r + .3576 * g + .1805 * b) / .95047, .2126 * r + .7152 * g + .0722 * b, (.0193 * r + .1192 * g + .9505 * b) / 1.08883
    t = lambda v: v ** (1 / 3) if v > .008856 else 7.787 * v + 16 / 116
    return (116 * t(Y) - 16, 500 * (t(X) - t(Y)), 200 * (t(Y) - t(Z)))


def delta_e(h1, h2):
    a, b = rgb_lab(hex_rgb(h1)), rgb_lab(hex_rgb(h2))
    return math.dist(a, b)


def med_hex(hs):
    ch = [sorted(hex_rgb(h)[i] for h in hs) for i in range(3)]
    return '#%02x%02x%02x' % tuple(int(statistics.median(c)) for c in ch)


AUTO_RE = re.compile(r'base (#[0-9a-fA-F]{6}) corps (#[0-9a-fA-F]{6}) pointe (#[0-9a-fA-F]{6}) confiance ([0-9.]+)')


def step_coloris(ctx):
    if ctx.dry:
        say('  [dry] refs.py url/auto on up to 3 photos of each A/B cultivar, medians, then Haiku for the low-confidence ones')
        return {'status': 'done', 'msg': 'dry', 'checks': {}}
    # levels A to C are measured (owner, 2026-10-17); a cultivar under a brand is measured too: its NAME is never shown (BONNES-PRATIQUES 4.9)
    rows = [r for r in census_table(ctx) if r['niveau'] in OK_LEVELS and r['photos']]
    if not rows:
        raise StepFailed('no A/B/C cultivar with photos in the census (run census first)')
    first = {sku_cultivar(rows, x.get('cultivar'))['nom'] for x in ctx.st.get('skus', []) if sku_cultivar(rows, x.get('cultivar'))}
    rows.sort(key=lambda r: (r['nom'] not in first, r['niveau'], -len(r['photos'])))
    rows = rows[:int(getattr(ctx.a, 'max_coloris', 60) or 60)]
    R = load_mod(ctx, 'refs')
    sidc = ctx.sid + '-coloris'
    meas = jload(ctx.rc + '/coloris-auto.json', {})
    for r in rows:
        if r['nom'] in meas:
            continue
        ph = sorted(r['photos'], key=lambda p: str(p.get('niveau') or 'N9'))[:3]
        res = []
        for p in ph:
            url = p.get('thumb') or p.get('img')
            if not url:
                continue
            try:
                quiet(R.addurl, sidc, url, r['nom'], p.get('page') or '')
                i = len(jload(R.d(sidc) + '/cands.json', [])) - 1
                m = AUTO_RE.search(quiet(R.auto, sidc, i))
                if m:
                    res.append({'i': i, 'base': m[1], 'corps': m[2], 'pointe': m[3], 'conf': float(m[4]), 'page': p.get('page'), 'niveau': p.get('niveau')})
            except Exception as e:
                say('  photo of %s skipped: %s' % (r['nom'], str(e)[:70]))
        meas[r['nom']] = res
        jsave(ctx.rc + '/coloris-auto.json', meas)
    out, low = [], []
    used = set()
    for r in rows:
        res = meas.get(r['nom']) or []
        good = [m for m in res if m['conf'] >= .5]
        cid = r.get('cid') or slug(r['nom'])[:24] or 'c'  # an imported census keeps the catalogue's ids (never change an id: 4.9)
        while cid in used:
            cid += 'x'
        used.add(cid)
        e = {'id': cid, 'cultivar': r['nom'], 'niveau': r['niveau'], 'marque': r['marque'], 'photos': [m['page'] for m in res], 'mesure': 'auto'}
        if good:
            for k in ('base', 'corps', 'pointe'):
                e[k] = med_hex([m[k] for m in good])
            e['confiance'] = round(statistics.median([m['conf'] for m in good]), 2)
            e['ecart_dE'] = round(max([delta_e(a['corps'], b['corps']) for a in good for b in good] or [0]), 1)
        if not good or len(good) < 2 or e.get('ecart_dE', 0) > 10:
            low.append({'id': cid, 'cultivar': r['nom'], 'cands': [m['i'] for m in res] or [], 'reason': 'no sure auto measure' if not good else 'one photo' if len(good) < 2 else 'dE %.0f' % e['ecart_dE'],
                        'auto': {k: e.get(k) for k in ('base', 'corps', 'pointe')}, 'pages': e['photos']})
        out.append(e)
    jsave(ctx.rc + '/coloris-low.json', low)
    for k in range(0, len(low), 12):
        n = k // 12 + 1
        if os.path.exists('%s/coloris-manual-%d.json' % (ctx.rc, n)):
            continue
        chunk = low[k:k + 12]
        jsave('%s/coloris-low-%d.json' % (ctx.rc, n), chunk)
        call_model(ctx, 'coloris', 'low%d' % n, 'haiku', prompt_text('coloris', **ctx.sub(n=n, low='%s/coloris-low-%d.json' % (ctx.rel, n), manual='%s/coloris-manual-%d.json' % (ctx.rel, n))),
                   READ + ['Write', 'Bash(python *)', 'Bash(ls *)', 'Bash(head *)', 'Bash(tail *)'], turns=40)
    man = {}
    for f in glob.glob(ctx.rc + '/coloris-manual-*.json'):
        for x in jload(f, []) or []:
            if isinstance(x, dict) and x.get('id') and x.get('ok', True):
                man[x['id']] = x
    keep, drop = [], []
    for e in out:
        m = man.get(e['id'])
        if m and all(re.match(r'^#[0-9a-fA-F]{6}$', str(m.get(k) or '')) for k in ('base', 'corps', 'pointe')):
            e.update({k: m[k] for k in ('base', 'corps', 'pointe')}, mesure='main')
            e.update({k: m[k] for k in ('revers', 'macule', 'eclairage') if m.get(k)})
        if all(re.match(r'^#[0-9a-fA-F]{6}$', str(e.get(k) or '')) for k in ('base', 'corps', 'pointe')) and e['niveau'] in OK_LEVELS:
            keep.append(e)
        else:
            drop.append({'id': e['id'], 'cultivar': e['cultivar'], 'raison': 'no measure'})
    jsave(ctx.rc + '/coloris.json', keep)
    cw_photo_audit(ctx)  # P7 again, against the measured colours: a coloris: photo far from its colourway leaves the pairs
    jsave(ctx.rc + '/coloris-ecartes.json', drop)
    L = ['# Coloris mesurés de %s (%d, %d écartés)' % (ctx.sid, len(keep), len(drop)), '', 'marque différente de « libre » : le nom du cultivar ne s\'affiche jamais (nom de couleur générique, BONNES-PRATIQUES 4.9).', '',
         '| id | cultivar | base | corps | pointe | revers | macule | niveau | marque | remarques |', '|---|---|---|---|---|---|---|---|---|---|']
    for e in keep:
        L.append('| %s | %s | %s | %s | %s | %s | %s | %s | %s | %s |' % (e['id'], e['cultivar'], e['base'], e['corps'], e['pointe'], e.get('revers') or '', e.get('macule') or '', e['niveau'],
                 e.get('marque') or 'libre', '%s, dE %s, %d photos' % (e['mesure'], e.get('ecart_dE', '-'), len(e['photos']))))
    open(ctx.rc + '/coloris.md', 'w', encoding='utf-8').write('\n'.join(L) + '\n')
    allr, kept_ids, ids = census_table(ctx), {e['id'] for e in keep}, {e['cultivar']: e['id'] for e in out}
    miss = []
    for x in ctx.st.get('skus', []):
        r = sku_cultivar(allr, x.get('cultivar'))
        if r is not None and r['niveau'] != 'D' and ids.get(r['nom']) not in kept_ids:  # a SKU not in the census or at D is a question (census)
            miss.append(x['sku'])
    ok = bool(keep) and not miss
    return {'status': 'done' if ok else 'failed', 'msg': '%d colourways measured, %d dropped, %d sent to Haiku%s' % (len(keep), len(drop), len(low), '; bouquet SKU without colour: ' + ', '.join(miss) if miss else ''),
            'checks': {'kept': len(keep), 'dropped': len(drop), 'low': len(low)}}


# ---------------------------------------------------------------------------------------------------------------- targets

FIT = ['fleur/portwrap_p.py', 'fleur/fit.py']  # fit.py renders through fleur/shot.sh: the wrapper sends it to the private shot_p.sh


def targets_cmd(ctx):
    """fit.py targets on the kept photos; the form family (grappe: an inflorescence, not a radial flower) is passed on, fit.py decides what it means"""
    cmd = [sys.executable] + FIT + ['targets', ctx.sid, '--refs', ctx.rel, '--out', ctx.rel + '/targets.json']
    fam = (ctx.st.get('family') or '').strip()
    return cmd + ['--family', fam] if fam else cmd


SILHOUETTE = ('hw', 'taper', 'fill')  # fit.py's measures of an inflorescence's outline (family grappe)


def check_targets(t):
    """at least 3 measures (silhouettes, colours, stem, leaf: all count); a cluster family (targets.json says family grappe) also needs its outline"""
    ms = t.get('m', [])
    n = len(ms)
    kinds = sorted({m.get('kind') for m in ms})
    sil = sum(1 for m in ms if m.get('kind') in SILHOUETTE)
    ok = n >= 3 and (t.get('family') != 'grappe' or sil >= 3)
    msg = '%d measures (%s), %d photos dropped' % (n, ','.join(map(str, kinds)), len(t.get('dropped', [])))
    if t.get('family') == 'grappe':
        msg += '; family grappe: %d outline measures%s' % (sil, '' if sil >= 3 else ' (3 needed: no whole inflorescence isolated in the photos)')
    return ok, msg, {'n': n, 'silhouette': sil}


def step_targets(ctx):
    if not have(ctx, 'fleur/fit.py'):
        return {'status': 'skipped', 'msg': 'fleur/fit.py not delivered yet'}
    code, text = run_cmd(ctx, targets_cmd(ctx), 'targets', timeout=1800)
    if ctx.dry:
        return {'status': 'done', 'msg': 'dry'}
    ok, msg, checks = check_targets(jload(ctx.rc + '/targets.json', {}))
    return {'status': 'done' if ok else 'failed', 'msg': msg, 'checks': checks}


# ---------------------------------------------------------------------------------------------------------------- fiche (P15)

SCHEMA_REL = 'catalogue/serre/methode/fiche/SCHEMA.md'
FICHE_MAX_CODE = 30          # % of the organ values with methode "code" at the fiche step (AUDIT-V4 P15)
FICHE_MIN_MESURES = 8        # organ values measured on the kept photos (segmente, mesure-echelle, regle)
FICHE_MIN_CMDS = 3           # measuring commands run by the step (organ.py, img.py pair, fit.py targets, refs.py ring/pal/auto)
FICHE_ROLES = ('perianthe', 'bouton', 'tige', 'feuille')
MEASURE_RE = re.compile(r'fleur/(?:organ\.py\s+(?:stem|leaf|head)|img\.py\s+pair|fit\.py\s+targets|refs\.py\s+(?:ring|pal|auto))\b')


def fiche_rel(ctx):
    return 'catalogue/serre/fiches/%s.json' % ctx.sid


def sha8(s):
    return hashlib.sha1(s.encode('utf-8')).hexdigest()[:8]


def kept_registry(ctx):
    """{fiche photo key: registry entry} of the kept photos (keep.json + cands.json): key <sid>:<sha1 of the image URL>[:8] (SCHEMA §3)"""
    K = jload(ctx.rc + '/keep.json', []) or []
    C = jload(ctx.rc + '/cands.json', []) or []
    out = {}
    for x in K:
        i = int(x.get('i', -1))
        img = (C[i].get('thumb') if 0 <= i < len(C) else None) or ''
        src, frm = (img, 'url_image') if img else (x.get('page') or x.get('title') or '', 'url')
        vu = VU_RE.search(x.get('m') or '')
        out['%s:%s' % (ctx.sid, sha8(src))] = {
            'titre': x.get('title'), 'auteur': x.get('author'), 'licence': x.get('lic'), 'url': x.get('page'), 'url_image': img or None,
            'local': '%srefcache/%s/t%03d.jpg' % (ctx.rel_url + '/' if ctx.rel_url else '', ctx.sid, i), 'tags': x.get('tags') or [],
            'vu': (vu.group(1).strip() if vu else x.get('m') or ''), 'echelle': None, 'cle_depuis': frm, 'local_index': i}
        if photo_groupe(x):  # SCHEMA §3: a photo of group "autre" never serves a measure
            out['%s:%s' % (ctx.sid, sha8(src))]['groupe'] = photo_groupe(x)
    return out


def fiche_skeleton(ctx):
    """catalogue/serre/fiches/<sid>.json: written once with its photo registry (the kept photos); later runs add the photos kept since, never
    remove what the step wrote. Returns 'new' | 'updated' | 'same'"""
    p = '%s/%s' % (ctx.ch, fiche_rel(ctx))
    reg = kept_registry(ctx)
    f = jload(p, None)
    if ctx.dry:
        say('  [dry] fiche %s: %s, %d kept photos in its registry' % (fiche_rel(ctx), 'present' if f else 'skeleton to write', len(reg)))
        return 'dry'
    if f is None:
        heads = sv_heads(ctx)
        f = {'schema': 'fiche-morpho/1', 'sid': ctx.sid, 'nom': '', 'taxon': {'genre': ctx.genus, 'espece': ctx.taxon, 'groupe': ctx.st.get('group') or ''},
             'kit': {'moteur': (os.path.basename(ctx.st.get('kit') or '') or 'à définir par le modeleur'), 'module': heads.get(ctx.sid) or 'app/y-%s.js' % slug(ctx.genus)},
             'etat': {'date': now()[:10], 'auteur': 'pipe.py (squelette), puis l\'étape fiche', 'note': 'Registre des photos posé d\'après keep.json (photos regardées).'},
             'photos': reg, 'organes': {}, 'varietes': {}, 'stades': {'table': []}, 'rendu': {}, 'questions': []}
        state = 'new'
    else:
        add = {k: v for k, v in reg.items() if k not in (f.get('photos') or {})}
        if not add:
            return 'same'
        f.setdefault('photos', {}).update(add)
        state = 'updated'
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8', newline='\n') as fo:
        fo.write(json.dumps(f, ensure_ascii=False, indent=1) + '\n')
    return state


def fiche_check(ctx, lien=None, tag='fiche-check'):
    """python fleur/fiche.py check <sid> [--lien]: (exit code, the JSON summary line or {}, the text)"""
    cmd = [sys.executable, 'fleur/fiche.py', 'check', ctx.sid, '--quiet'] + (['--lien', lien] if lien else [])
    c, t = run_cmd(ctx, cmd, tag, timeout=600, quiet=True)
    return c, (last_json(t) or {}) if not ctx.dry else {}, t


def fiche_cmds(ctx):
    """the measuring commands of the fiche calls (Bash), kept across calls and resumptions in fiche-mesures.json"""
    p = ctx.rc + '/fiche-mesures.json'
    seen = jload(p, []) or []
    seen += [c[:2000] for c in ctx.cmds.get('fiche', []) if MEASURE_RE.search(c)]
    seen = list(dict.fromkeys(seen))
    if not ctx.dry:
        jsave(p, seen)
    return sum(len(MEASURE_RE.findall(c)) for c in seen)


def check_fiche(ctx):
    """P15: fiche.py check exits 0; under 30 % of "code" values; at least 8 values measured on photos with the measuring tools run in the step;
    the roles perianthe, bouton, tige, feuille described; only kept photos in its registry"""
    why = []
    p = '%s/%s' % (ctx.ch, fiche_rel(ctx))
    if not os.path.exists(p) and not ctx.dry:
        return False, '%s missing' % fiche_rel(ctx)
    c, s, t = fiche_check(ctx)
    if ctx.dry:
        return True, ''
    if c != 0 or not s.get('valide'):
        errs = [ln.strip() for ln in t.splitlines() if 'ERREUR' in ln or ln.strip().startswith('!')][:6]
        why.append('fiche.py check: %s (%s)' % ('NON VALIDE' if s else 'no summary, exit %d' % c, '; '.join(errs) or (t.strip().splitlines() or [''])[-1][:120]))
    if s:
        if s.get('code_pct', 100) >= FICHE_MAX_CODE:
            why.append('%s %% of the values are "code" (under %d %% wanted: measure them)' % (s.get('code_pct'), FICHE_MAX_CODE))
        if s.get('mesures', 0) < FICHE_MIN_MESURES:
            why.append('%d values measured (segmente, mesure-echelle, regle), %d wanted' % (s.get('mesures', 0), FICHE_MIN_MESURES))
        miss = [r for r in FICHE_ROLES if r not in (s.get('roles') or [])]
        if miss:
            why.append('roles not described: ' + ', '.join(miss))
    n = fiche_cmds(ctx)
    if n < FICHE_MIN_CMDS:
        why.append('%d measuring commands run in the step (organ.py stem|leaf|head, img.py pair, fit.py targets, refs.py ring|pal|auto): %d wanted' % (n, FICHE_MIN_CMDS))
    f = jload(p, {}) or {}
    kept = set(kept_registry(ctx))
    foreign = sorted(k for k in (f.get('photos') or {}) if k not in kept)
    if foreign:
        why.append('photos not kept (keep.json) in the registry: ' + ', '.join(foreign[:6]))
    return (not why), '; '.join(why)


def step_fiche(ctx):
    ensure_docs(ctx)
    if not have(ctx, 'fleur/fiche.py'):
        return {'status': 'skipped', 'msg': 'fleur/fiche.py not delivered yet'}
    st = fiche_skeleton(ctx)
    tools = READ + ['Write', 'Edit'] + SAFE_BASH
    res, fin = model_loop(ctx, 'fiche', 'fiche', 'sonnet', tools, int(getattr(ctx.a, 'relays', 4) or 4), lambda: check_fiche(ctx),
                          extra={'fiche': fiche_rel(ctx), 'schema': SCHEMA_REL}, must_read=[SCHEMA_REL])
    if res == 'blocked':
        raise StepFailed('fiche blocked: %s' % (fin.get('question') or fin.get('note') or fin))
    ok, why = check_fiche(ctx)
    c, s, t = fiche_check(ctx) if not ctx.dry else (0, {}, '')
    return {'status': 'done' if res == 'done' and ok else 'failed', 'checks': s,
            'msg': 'fiche %s (%s): %s%s' % (res, st, ', '.join('%s %s' % (k, s[k]) for k in ('valeurs', 'mesures', 'code_pct', 'hypothese', 'photos') if k in s) or 'dry',
                                          '' if ok else '; check: ' + why)}


# ---------------------------------------------------------------------------------------------------------------- Opus / Sonnet loops

LOCKED = ('forme', 'fit', 'plante', 'finition', 'comparaison', 'juge', 'temoins', 'qa', 'planches')  # they edit, rebuild, render or judge the copy: one at a time


def get_lock(ctx, kind):
    """one Opus at a time per working copy (and nobody rebuilding it meanwhile): held by the runner around the steps of LOCKED"""
    lk = Lock([kind + '-' + os.path.basename(ctx.ch)], ctx.sid)
    if not ctx.dry:
        lk.acquire(wait=True)
    return lk


def model_loop(ctx, step, pname, model, tools, max_calls, done_check, turns=None, extra=None, must_read=()):
    """calls with an empty context until the model says done AND the check passes; a call that stops on the turn cap, the clock or 'relay' is
    followed by a fresh one that reads etat-<step>.md (written by the model; a stub of ours is APPENDED, the model's state is never lost).
    must_read: files the step must open with Read (BONNES-PRATIQUES.md): a call that did not is told so, and the step cannot end without them.
    Returns ('done'|'relay'|'blocked', last final)"""
    etat = '%s/etat-%s.md' % (ctx.rel, step)
    why = ''
    fin = {}
    for k in range(1, max_calls + 1):
        resumed = k > 1 or os.path.exists(ctx.rc + '/etat-%s.md' % step)
        relay = ''
        if resumed:
            relay = ('RELAIS %d: you resume work already started. Read %s first, then the last 15 lines of %s/journal.md; do not redo what is done.%s'
                     % (k, etat, ctx.rel, ' The pipeline check failed: ' + why if why else ''))
        t0 = time.time()
        subs = ctx.sub(relay=relay, etat=etat, **(extra or {}))
        r = call_model(ctx, step, 'r%d' % k, model, prompt_text(pname, **subs), tools, turns=turns)
        fin = r.get('final') or {}
        if ctx.dry:
            done_check()
            return 'done', fin
        unread = [m for m in must_read if ctx.npath(m) not in set(r.get('reads') or [])]
        if unread:
            say('  %s/r%d did not open %s' % (step, k, ', '.join(os.path.basename(m) for m in unread)))
        if fin.get('status') == 'blocked':
            return 'blocked', fin
        if fin.get('status') == 'done' and not r['timeout']:
            ok, why = done_check()
            never = [m for m in must_read if not ctx.read_by(step, m)]
            if never:
                ok, why = False, ('; '.join(x for x in (why, 'you never opened %s in full: read it, then check your work against it' % ', '.join(never)) if x))
            if ok:
                return 'done', fin
            say('  %s: check failed: %s' % (step, why[:200]))
        else:
            why = ''
            p = ctx.rc + '/etat-%s.md' % step
            if not os.path.exists(p) or os.path.getmtime(p) < t0:
                with open(p, 'a', encoding='utf-8', newline='\n') as f:
                    f.write('\n\n# Note de pipe.py (%s)\n\nL\'appel %d de l\'étape %s s\'est arrêté (%s, %d tours) sans mettre cet état à jour.\n'
                            'Lis la fin de journal.md et `git status --short` pour voir ce qui est fait, puis continue.\n' % (now(), k, step, r['subtype'], r['turns']))
    return 'relay', fin


def sv_heads(ctx):
    """{sid: the sheet file} of every head registered in app/y-*.js and yz-*.js (SV_HEAD['sid'] or SV_HEAD[CONST] with CONST='sid')"""
    files = sorted(glob.glob(ctx.ch + '/app/y-*.js') + glob.glob(ctx.ch + '/app/yz-*.js'))
    text = {f: open(f, encoding='utf-8', errors='replace').read() for f in files}
    consts = {}
    for t in text.values():
        for k, v in re.findall(r'(?:const|let|var)\s+(\w+)\s*=\s*[\'"]([^\'"]+)[\'"]', t):
            consts.setdefault(k, v)
    out = {}
    for f, t in text.items():
        for x in re.findall(r'SV_HEAD\[\s*[\'"]([^\'"]+)[\'"]\s*\]', t) + [consts[i] for i in re.findall(r'SV_HEAD\[\s*([A-Za-z_]\w*)\s*\]', t) if i in consts]:
            out.setdefault(x, 'app/' + os.path.basename(f))
    return out


def check_forme(ctx, space='space.json'):
    g = slug(ctx.genus)
    why = []
    js = 'app/y-%s.js' % g
    heads = sv_heads(ctx)
    if ctx.sid in heads:
        js = heads[ctx.sid]  # a sort of a genus already drawn (yz-*.js, a shared genus sheet)
    elif not have(ctx, js):
        why.append('%s missing and no SV_HEAD[\'%s\'] in app/y-*.js, yz-*.js' % (js, ctx.sid))
    if have(ctx, js):
        for f in ('mkapp.sh', 'mkqa.sh', 'mkpl.sh'):  # the build scripts take app/y-*.js and yz-*.js by themselves (ls): registered either way
            try:
                t = open('%s/%s' % (ctx.ch, f), encoding='utf-8').read()
                if os.path.basename(js) not in t and 'ls %s-*.js' % os.path.basename(js).split('-')[0] not in t:
                    why.append('%s not registered in %s' % (os.path.basename(js), f))
            except Exception:
                why.append(f + ' unreadable')
    sp = jload('%s/%s' % (ctx.rc, space), None)
    if not isinstance(sp, dict) or not sp.get('set'):
        why.append('%s missing, not JSON, or without a "set" list' % space)
    else:
        badp = [x for x in sp['set'] if not isinstance(x, dict) or not x.get('path') or not (x.get('link') or x.get('type') or all(k in x for k in ('min', 'max', 'step')))]
        if badp:
            why.append('%d entries of %s lack path and (min,max,step | link | type)' % (len(badp), space))
    if not why and not ctx.dry:
        c1, t1 = run_cmd(ctx, [sh_exe(), 'mkapp.sh'], 'build-app', timeout=600, quiet=True)
        c2, t2 = run_cmd(ctx, [sys.executable, 'pilote/mksv.py'], 'build-sv', timeout=600, quiet=True)
        if c1 or c2:
            why.append('build failed: ' + (t1 if c1 else t2).strip().splitlines()[-1][:120])
    # P15: the fiche tied to the drawing (fiche.py point 3: code/retenu as in the code, or a typed ecart); head values at forme, all at plante
    lien = 'tete' if space == 'space.json' else 'tout'
    if not why and have(ctx, 'fleur/fiche.py'):
        if not have(ctx, fiche_rel(ctx)) and not ctx.dry:
            why.append('%s missing (step fiche)' % fiche_rel(ctx))
        else:
            c, s, t = fiche_check(ctx, lien, 'fiche-lien-' + lien)
            if c and not ctx.dry:
                bad = [ln.strip() for ln in t.splitlines() if ln.strip().startswith('!') or 'ERREUR' in ln][:6]
                why.append('fiche.py check --lien %s: %d error(s), %s unlinked (%s)' % (lien, s.get('erreurs', -1), s.get('non_relies', '?'), '; '.join(bad)))
    # P8: forme is "done" only with its face pair measured and the sort's rtest, both after the last retouch and both written in the journal
    if not why and space == 'space.json' and not ctx.dry:
        ok8, why8 = check_forme_proofs(ctx)
        if not ok8:
            why.append(why8)
    return (not why), '; '.join(why)


# ---------------------------------------------------------------------------------------------------------------- forme's proofs (P8)

FACE_RE = re.compile(r'^(photo|rendu): H/W [\d.]+\s+W/H ([\d.]+)', re.M)
J_FACE = re.compile(r'paire face\b[^\n]*?photo\s+W/H\s+([\d.]+)[^\n]*?rendu\s+W/H\s+([\d.]+)', re.I)
J_RTEST = re.compile(r'\brtest\b[^\n]*?(?:(\d+)\s+bouquets?\s+chang|\bIDENTIQUE\b)', re.I)


def own_rc(ctx):
    """the rtest recipe of the sort: its bouquet SKUs with their stems, else its first colourway with 6 stems"""
    return ['%s:%s' % (x['sku'], x.get('tiges') or 6) for x in ctx.st.get('skus', []) if x.get('sku')] or ['%s~0:6' % ctx.sid]


def rtest_policy(ctx):
    """('strict' | 'report', why). Owner, 2026-10-18: real-size heads (anthurium) and curved wilted necks may move the bouquets
    (« la composition peut bouger », --rtest-bouge); a sort whose sid already sells with an old drawing (it is in the SKU dump taken before
    forme) is a NEW drawing replacing it: a changed rtest is reported (journal: how many bouquets changed), not blocking. Else IDENTIQUE."""
    if ctx.st.get('rtest_bouge'):
        return 'report', 'décision du porteur (--rtest-bouge : %s)' % ctx.st['rtest_bouge']
    pb = ctx.rc + '/temoins/sku-avant.csv'
    rows = [ln.split(';') for ln in open(pb, encoding='utf-8', errors='replace').read().splitlines()[1:]] if os.path.exists(pb) else []
    n = sum(1 for r in rows if len(r) > 2 and r[2] == ctx.sid)
    if n:
        return 'report', 'la sorte remplace un ancien dessin (%d produits de %s dans la boutique avant forme)' % (n, ctx.sid)
    return 'strict', 'sorte sans ancien dessin : le hasard des bouquets ne doit pas bouger'


def rtest_text(ctx):
    pol, why = rtest_policy(ctx)
    if pol == 'strict':
        return 'il doit être IDENTIQUE (%s) : la tête nouvelle se place dans la boîte de l\'ancien dessin' % why
    return 'un rtest changé est admis (%s), mais le nombre de bouquets changés s\'écrit au journal' % why


def rtest_counts(path):
    """(items, identical, different, errors) of an rtest output file"""
    r = rtest_parse(open(path, encoding='utf-8', errors='replace').read()) if os.path.exists(path) else {}
    v = list(r.values())
    return len(v), v.count('IDENTIQUE'), v.count('DIFFERENT'), v.count('ERR')


def write_forme_tools(ctx):
    """before forme: the comparison pairs (refaire.sh: `face` is forme's proof) and refcache/<sid>/rtest.sh (the sort's rtest through the gate)"""
    plan, missing = pair_plan(ctx)
    write_pairs(ctx, plan)
    rw = os.environ.get('PIPE_RAMWAIT', RAMWAIT)
    url = ctx.url('pilote/sv.html') + '?rtest=1&rc=%s&sv=11' % ','.join(own_rc(ctx))
    S = ['#!/bin/sh', '# rtest.sh: the rtest of %s (rc %s: the bouquet with the SVG heads off and on) through the gate, after a rebuild.' % (ctx.sid, ','.join(own_rc(ctx))),
         '# Written by fleur/pipe.py (never edit). Output: %s/temoins/rtest-forme.txt ; the line to copy into the journal is printed last.' % ctx.rel,
         'cd "$(dirname "$0")/../.." || exit 1'] + (['sh "%s" >/dev/null' % rw] if rw else []) + [
         'sh mkapp.sh | tail -1 && python pilote/mksv.py >/dev/null || { echo "rtest: build failed"; exit 1; }',
         'mkdir -p %s/temoins' % ctx.rel,
         'sh ws/gate.sh sh ws/chrome1.sh dom "%s&nc=$(date +%%s)" %s/temoins/rtest-forme.txt >/dev/null' % (url, ctx.rel),
         'python fleur/pipe.py rtsum %s/temoins/rtest-forme.txt' % ctx.rel]
    if ctx.dry:
        say('  [dry] %s/rtest.sh: %s' % (ctx.rel, url))
        return missing
    with open(ctx.rc + '/rtest.sh', 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(S) + '\n')
    return missing


def check_forme_proofs(ctx):
    """P8: (a) comparaison/face.png and face.txt made after the last change of app/, their W/H written in journal.md (« paire face | photo W/H x |
    rendu W/H y »); (b) temoins/rtest-forme.txt made after the last change of app/: IDENTIQUE, or under the report policy the number of changed
    bouquets written in journal.md (« rtest | n bouquets changés »); an ERR item always fails"""
    why, at = [], app_mtime(ctx)
    jt = open(ctx.rc + '/journal.md', encoding='utf-8', errors='replace').read() if os.path.exists(ctx.rc + '/journal.md') else ''
    ft = ctx.rc + '/comparaison/face.txt'
    if not os.path.exists(ft) or not os.path.exists(ctx.rc + '/comparaison/face.png'):
        why.append('no face pair (sh %s/comparaison/refaire.sh face)' % ctx.rel)
    elif os.path.getmtime(ft) < at:
        why.append('face pair older than the last change of app/ (sh %s/comparaison/refaire.sh face)' % ctx.rel)
    else:
        m = dict(FACE_RE.findall(open(ft, encoding='utf-8', errors='replace').read()))
        if 'photo' not in m or 'rendu' not in m:
            why.append('face.txt without the W/H of the photo and of the render (no silhouette?)')
        else:
            got = [(float(a), float(b)) for a, b in J_FACE.findall(jt)]
            if not got:
                why.append('journal.md lacks « paire face | photo W/H %s | rendu W/H %s »' % (m['photo'], m['rendu']))
            elif abs(got[-1][0] - float(m['photo'])) > .011 or abs(got[-1][1] - float(m['rendu'])) > .011:
                why.append('the last « paire face » line of journal.md (%.2f / %.2f) is not face.txt (%s / %s)' % (got[-1] + (m['photo'], m['rendu'])))
    rt = ctx.rc + '/temoins/rtest-forme.txt'
    pol, pwhy = rtest_policy(ctx)
    n, same, diff, err = rtest_counts(rt)
    if not n:
        why.append('no rtest of the sort (sh %s/rtest.sh)' % ctx.rel)
    elif os.path.getmtime(rt) < at:
        why.append('rtest older than the last change of app/ (sh %s/rtest.sh)' % ctx.rel)
    elif err:
        why.append('rtest: %d bouquet(s) in error (ERR)' % err)
    else:
        lines = J_RTEST.findall(jt)
        last = None if not lines else (0 if lines[-1] == '' else int(lines[-1]))
        if diff and pol == 'strict':
            why.append('rtest: %d of %d bouquets changed; it must stay IDENTIQUE (%s)' % (diff, n, pwhy))
        elif last is None:
            why.append('journal.md lacks the rtest line (« rtest | %s »)' % ('IDENTIQUE' if not diff else '%d bouquets changés sur %d' % (diff, n)))
        elif last != diff:
            why.append('the last rtest line of journal.md says %d changed, the rtest %d' % (last, diff))
    return (not why), '; '.join(why)


def step_forme(ctx):
    ensure_docs(ctx)
    witness_before(ctx)  # the SKU dump and the kit sorts' sheets BEFORE the modeller touches app/ (compared at temoins)
    write_forme_tools(ctx)  # refaire.sh (the face pair) and rtest.sh: forme's proofs (P8)
    tools = READ + ['Write', 'Edit'] + SAFE_BASH
    res, fin = model_loop(ctx, 'forme', 'forme', 'opus', tools, int(getattr(ctx.a, 'relays', 4)), lambda: check_forme(ctx),
                          extra={'kit': kit_text(ctx), 'fiche': fiche_rel(ctx), 'rtest': rtest_text(ctx)}, must_read=[bp_rel(ctx), fiche_rel(ctx)])
    if res == 'blocked':
        raise StepFailed('forme blocked by the modeller: %s' % (fin.get('question') or fin.get('note') or fin))
    ok, why = check_forme(ctx)
    return {'status': 'done' if res == 'done' else 'failed', 'msg': 'forme %s%s; %s' % (res, '' if ok else ' (check: %s)' % why, fin.get('note', '')), 'relays_used': True}


# ---------------------------------------------------------------------------------------------------------------- fit

def fit_summary(path):
    d = jload(path, None)
    if not isinstance(d, dict):
        return 'fit.json unreadable'
    nums = ['%s %s' % (k, round(v, 3) if isinstance(v, float) else v) for k, v in d.items() if isinstance(v, (int, float)) and not isinstance(v, bool)][:6]
    best = d.get('best')
    return '%d settings fitted%s' % (len(best) if isinstance(best, (dict, list)) else 0, ('; ' + ', '.join(nums)) if nums else '')


def run_fit(ctx, space, outdir):
    ramwait(ctx, 'fit.py (%s)' % outdir)
    cmd = [sys.executable] + FIT + [ctx.sid, '--space', '%s/%s' % (ctx.rel, space), '--targets', ctx.rel + '/targets.json', '--budget', str(getattr(ctx.a, 'budget', 60)), '--out', '%s/%s' % (ctx.rel, outdir)]
    if getattr(ctx.a, 'cw', None) is not None:
        cmd += ['--cw', str(ctx.a.cw)]
    return run_cmd(ctx, cmd, 'fit-' + outdir, timeout=3600)


def step_fit(ctx, part='forme'):
    space, outdir, pname = ('space.json', 'fit', 'forme') if part == 'forme' else ('space-plante.json', 'fit-plante', 'plante')
    if not have(ctx, 'fleur/fit.py'):
        return {'status': 'skipped', 'msg': 'fleur/fit.py not delivered yet'}
    if not os.path.exists(ctx.rc + '/targets.json') and not ctx.dry:
        return {'status': 'skipped', 'msg': 'no targets.json (the targets step was skipped or failed): no fit'}
    need_servers(ctx)
    code, text = run_fit(ctx, space, outdir)
    d = '%s/%s' % (ctx.rc, outdir)
    if not ctx.dry and (code != 0 or not os.path.exists(d + '/fit.json')):
        raise StepFailed('fit.py code %d: %s' % (code, (text.strip().splitlines() or [''])[-1][:160]))
    summ = fit_summary(d + '/fit.json') if not ctx.dry else 'dry'
    r = call_model(ctx, 'fit' if part == 'forme' else 'plante', 'look', 'opus', prompt_text('fit', **ctx.sub(part=part, space='%s/%s' % (ctx.rel, space), out='%s/%s' % (ctx.rel, outdir), summary=summ)),
                   READ + ['Write', 'Edit'] + SAFE_BASH, turns=40)  # 16 ran out on a lilac look (a render with the wrong sid, then the journal); xhigh thinks longer
    fin = r.get('final') or {}
    ok = ctx.dry or (fin.get('status') == 'done' and os.path.exists(d + '/fit.png'))
    return {'status': 'done' if ok else 'failed', 'msg': '%s; look: %s' % (summ, fin.get('verdict') or fin.get('note') or r['subtype']), 'checks': {'fit_png': os.path.exists(d + '/fit.png')}}


JGAP_ST = '.1:0,.3:0,.6:0,1:0,1:.4,1:.75'  # the plant sheet jgap.py reads: one cell per stage, full=40 cm


def plant_gaps(ctx):
    """P5: fleur/jgap.py on a plant=1 sheet (6 stages, full 40 cm): no detached piece in any cell (BONNES-PRATIQUES: nothing floats).
    (ok, message, per-cell counts)"""
    ids = cw_ids(ctx, 1)
    full = int(getattr(ctx.a, 'full', 40) or 40)
    q = 'plant=1&sid=%s&cw=%s&st=%s&axv=1&full=%d&seed=%d' % (ctx.sid, ids[0] if ids else '', JGAP_ST, full, SEED)
    name = 'jg_%s' % slug(ctx.sid)[:30]
    good, m, text = shot(ctx, name, q, 'jgap-render')
    if ctx.dry:
        run_cmd(ctx, [sys.executable, 'fleur/jgap.py', 'fleur/out/%s.png' % name, str(len(JGAP_ST.split(','))), str(full)], 'jgap', timeout=300, quiet=True)
        return True, 'dry', []
    if not good:
        return False, 'jgap: no plant render (%s)' % (text.strip().splitlines() or [''])[-1][:160], []
    c, t = run_cmd(ctx, [sys.executable, 'fleur/jgap.py', 'fleur/out/%s.png' % name, str(len(JGAP_ST.split(','))), str(full)], 'jgap', timeout=300, quiet=True)
    return jgap_verdict(t)


def jgap_verdict(t):
    rows = [ln for ln in t.splitlines() if re.match(r'^(cell)?\d+', ln.strip())]
    n = [int(m.group(1)) for m in (re.search(r'pieces apart: (\d+)', ln) for ln in rows) if m]
    empty = [ln for ln in rows if 'empty' in ln]
    if not rows or len(n) + len(empty) != len(rows):
        return False, 'jgap.py gave no reading (%s)' % (t.strip().splitlines() or [''])[-1][:120], n
    bad = ['cell %d: %d piece(s) apart' % (i, k) for i, k in enumerate(n) if k]
    if empty:
        bad.append('%d empty cell(s)' % len(empty))
    return (not bad), ('jgap: no detached piece in %d cells' % len(n)) if not bad else 'jgap (fleur/jgap.py): ' + '; '.join(bad), n


def check_plante(ctx):
    ok, why = check_forme(ctx, 'space-plante.json')
    if ok and not ctx.dry:
        ok, why, n = plant_gaps(ctx)
    return ok, why


def step_plante(ctx):
    ensure_docs(ctx)
    res, fin = model_loop(ctx, 'plante', 'plante', 'opus', READ + ['Write', 'Edit'] + SAFE_BASH, int(getattr(ctx.a, 'relays', 4)), lambda: check_plante(ctx),
                          extra={'fiche': fiche_rel(ctx)}, must_read=[bp_rel(ctx)])
    if res == 'blocked':
        raise StepFailed('plante blocked by the modeller: %s' % (fin.get('question') or fin.get('note') or fin))
    if res != 'done':
        return {'status': 'failed', 'msg': 'plante not finished after the relays (resume with --from plante)'}
    r = step_fit(ctx, 'plante')
    g_ok, g_msg, n = plant_gaps(ctx)  # the fit and its look may change the stem: nothing may float after them either
    r['msg'] = 'plante done; %s; %s' % (r['msg'], g_msg)
    if not g_ok:
        r['status'] = 'failed'
    return r


# ---------------------------------------------------------------------------------------------------------------- shots, finition, witnesses

def last_json(text):
    for line in reversed((text or '').splitlines()):
        line = line.strip()
        if line.startswith('{') and line.endswith('}'):
            try:
                return json.loads(line)
            except Exception:
                pass
    return None


def shot(ctx, name, query, tag):
    """fleur/shot_p.sh (the private copy: port of FLEUR_PORT) through the gate: (png written?, the measures {n, el, kb, patch}, text)"""
    need_servers(ctx)
    ramwait(ctx, 'render ' + name)
    code, text = run_cmd(ctx, [sh_exe(), 'fleur/shot_p.sh', name, query], tag, timeout=1500)
    ok = os.path.exists('%s/fleur/out/%s.png' % (ctx.ch, name)) and 'PAS D\'IMAGE' not in text
    return ok, last_json(text), text


def cw_ids(ctx, n=4):
    ids = [e['id'] for e in jload(ctx.rc + '/coloris.json', [])][:n]
    return ids


STAGES = '.06:0,.2:0,.4:0,.75:0,1:0,1:.35,1:.6,1:.75,1:.9'


def budget(ctx, tag):
    """elements and KB per head at DET 1: a MEASURE only (owner, 2026-10-17: « le poids je m'en fiche »); fails only when nothing renders"""
    ids = cw_ids(ctx, 2)
    if not ids and not ctx.dry:
        raise StepFailed('no coloris.json: no colourway to measure')
    q = 'grid=1&sid=%s&cws=%s&st=.06:0,.4:0,.85:0,1:.6,1:.9&view=2,0&D=120&det=1&seed=%d' % (ctx.sid, ','.join(ids), SEED)
    ok, m, text = shot(ctx, tag, q, 'budget-' + tag)
    if ctx.dry:
        return True, 'dry', {}
    if not ok or not m:
        return False, 'no render (%s)' % (text.strip().splitlines() or [''])[-1][:100], {}
    over = m.get('el', 0) > 1.2 * TARGET_EL or m.get('kb', 0) > 1.2 * TARGET_KB
    return True, '%s elements and %s KB per head at DET 1 (measure only; about %d / %d%s)' % (m.get('el'), m.get('kb'), TARGET_EL, TARGET_KB,
                                                                                         ', above 1.2 x' if over else ''), m


# P6: the colour of every colourway, rendered open and face on, against its measured body colour (coloris.json corps), with fleur/cwmed.py
CW_D, CW_CHUNK = 200, 12           # head size of the colour sheet; colourways per sheet (one column, one row each)
CW_DL, CW_DH, CW_DC = 7, 10, 6     # |dL| <= 7 and |dh| <= 10 deg (AUDIT-V4 P6); low chroma (whites, creams, greys): |dL| <= 7 and |dC| <= 6 (BP 4.4)
CW_LOWC = 15                       # target chroma under which the hue means nothing (BONNES-PRATIQUES 4.4: compare lightness and chroma)
CWMED_RE = re.compile(r'^(\S+)\s+L(-?\d+) C(\d+) h(\d+) \| cible #([0-9a-fA-F]{6}) L(-?\d+) C(\d+) h(\d+) dL=([+-]?\d+) dh=([+-]?\d+)', re.M)


def cw_verdict(text):
    """cwmed.py's lines -> [{id, L, C, h, cible, L2, C2, h2, dL, dh, dC, rule, ok}]: low chroma targets by lightness and chroma, the others by
    lightness and hue"""
    out = []
    for m in CWMED_RE.finditer(text or ''):
        L, C, h, L2, C2, h2, dL, dh = (int(m.group(i)) for i in (2, 3, 4, 6, 7, 8, 9, 10))
        low = C2 < CW_LOWC
        ok = abs(dL) <= CW_DL and (abs(C - C2) <= CW_DC if low else abs(dh) <= CW_DH)
        out.append({'id': m.group(1), 'L': L, 'C': C, 'h': h, 'cible': '#' + m.group(5).lower(), 'L2': L2, 'C2': C2, 'h2': h2, 'dL': dL, 'dh': dh, 'dC': C - C2,
                    'rule': 'L+C' if low else 'L+h', 'ok': ok})
    return out


def colour_check(ctx, tag='couleur'):
    """every colourway of coloris.json rendered open (.85) face on at D 200, one column, CW_CHUNK rows a sheet; cwmed.py against its corps.
    (ok, message, rows); the rows go to refcache/<sid>/couleur.json and couleur.md"""
    cws = [e for e in jload(ctx.rc + '/coloris.json', []) or [] if re.match(r'^#[0-9a-fA-F]{6}$', str(e.get('corps') or ''))]
    if not cws and not ctx.dry:
        return False, 'no measured colourway in coloris.json (corps)', []
    rows, miss = [], []
    for k in range(0, max(1, len(cws)), CW_CHUNK):
        part = cws[k:k + CW_CHUNK]
        ids = [e['id'] for e in part]
        name = '%s_%s_%d' % (tag, slug(ctx.sid)[:24], k // CW_CHUNK)
        q = 'grid=1&sid=%s&cws=%s&st=.85:0&view=0&D=%d&det=1&seed=%d' % (ctx.sid, ','.join(ids), CW_D, SEED)
        good, m, text = shot(ctx, name, q, '%s-%d' % (tag, k // CW_CHUNK))
        targets = ','.join('%s=%s' % (e['id'], e['corps'].lstrip('#')) for e in part)
        c, t = run_cmd(ctx, [sys.executable, 'fleur/cwmed.py', 'fleur/out/%s.png' % name, str(CW_D), ','.join(ids), '0', targets], '%s-cwmed-%d' % (tag, k // CW_CHUNK),
                       timeout=300, quiet=True)
        if ctx.dry:
            continue
        if not good:
            return False, 'colour sheet not rendered (%s)' % (text.strip().splitlines() or [''])[-1][:160], rows
        got = cw_verdict(t)
        miss += [i for i in ids if i not in {r['id'] for r in got}]
        rows += got
    if ctx.dry:
        return True, 'dry', []
    bad = [r for r in rows if not r['ok']]
    jsave(ctx.rc + '/couleur.json', rows)
    L = ['# Couleur rendue contre la mesure (%s)' % ctx.sid, '', 'Tête ouverte (.85) de face, D %d, médiane par `fleur/cwmed.py` contre `corps` de coloris.json. '
         'Règle : |dL| ≤ %d et |dh| ≤ %d° ; chroma de la cible sous %d (blancs, crèmes, gris) : |dL| ≤ %d et |dC| ≤ %d (BONNES-PRATIQUES 4.4).' % (CW_D, CW_DL, CW_DH, CW_LOWC, CW_DL, CW_DC), '',
         '| coloris | rendu L C h | cible | dL | dh | dC | règle | verdict |', '|---|---|---|---|---|---|---|---|']
    L += ['| %s | %d %d %d | %s | %+d | %+d | %+d | %s | %s |' % (r['id'], r['L'], r['C'], r['h'], r['cible'], r['dL'], r['dh'], r['dC'], r['rule'], 'ok' if r['ok'] else 'À REPRENDRE')
          for r in rows]
    open(ctx.rc + '/couleur.md', 'w', encoding='utf-8', newline='\n').write('\n'.join(L) + '\n')
    why = ['%s (dL %+d, %s)' % (r['id'], r['dL'], 'dC %+d' % r['dC'] if r['rule'] == 'L+C' else 'dh %+d°' % r['dh']) for r in bad]
    if miss:
        why.append('not measured on the sheet: ' + ', '.join(miss))
    msg = ('colour of %d colourways within dL %d / dh %d° (dC %d for whites)' % (len(rows), CW_DL, CW_DH, CW_DC)) if not why else \
        'colourways off their measure (%s/couleur.md): %s' % (ctx.rel, ', '.join(why))
    return (not why), msg, rows


def step_finition(ctx):
    def chk():
        ok, msg, m = budget(ctx, 'fin_' + ctx.sid)
        if not ok:
            return ok, msg
        return colour_check(ctx)[:2]  # P6: a colourway off its measure is sent back to the finition, by name
    res, fin = model_loop(ctx, 'finition', 'finition', 'sonnet', READ + ['Write', 'Edit'] + SAFE_BASH, 2, chk)
    ok, msg, m = budget(ctx, 'fin_' + ctx.sid) if not ctx.dry else (True, 'dry', {})
    c_ok, c_msg, rows = colour_check(ctx) if not ctx.dry else (True, 'dry', [])
    return {'status': 'done' if (res == 'done' and ok and c_ok) else 'failed', 'msg': 'finition %s; %s; %s' % (res, msg, c_msg), 'checks': dict(m or {}, couleur=len(rows),
            couleur_ko=[r['id'] for r in rows if not r['ok']])}


# ---------------------------------------------------------------------------------------------------------------- kit sorts

def kit_names(text):
    """the top-level names a kit piece defines (function X, const/let/var X =)"""
    return [a or b for a, b in re.findall(r'(?m)^(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=)', text)]


def kit_prefix(names):
    """the family prefix of a kit piece: for its lower-case and its upper-case names, the longest start shared by 60 % of them (svRose|SVROSE_)"""
    from collections import Counter
    out = []
    for grp in ([n for n in names if n[:1].islower()], [n for n in names if n[:1].isupper()]):
        if not grp:
            continue
        best = None
        for L in range(max(len(n) for n in grp), 2, -1):
            c = Counter(n[:L] for n in grp if len(n) >= L)
            if c and c.most_common(1)[0][1] >= .6 * len(grp):
                best = c.most_common(1)[0][0]
                break
        if best:
            if best[:1].isupper() and '_' in best:
                best = best[:best.index('_') + 1]
            out.append(best)
    return '|'.join(out)


def kit_sorts(ctx, prefix, names):
    """the sorts already drawn with a kit piece: the heads of the sheets app/y-*.js, yz-*.js that use one of the names it defines with its prefix
    (whole names: svRose must not catch svRosette)"""
    pre = [p for p in (prefix or '').split('|') if p]
    used = [n for n in names if any(n.startswith(p) for p in pre)] or names
    if not used:
        return []
    pat = re.compile(r'\b(?:%s)\b' % '|'.join(re.escape(n) for n in sorted(used, key=len, reverse=True)))
    heads = sv_heads(ctx)
    files = {f: open('%s/%s' % (ctx.ch, f), encoding='utf-8', errors='replace').read() for f in sorted(set(heads.values()))}
    return sorted(sid for sid, f in heads.items() if pat.search(files[f]))


def kit_info(ctx):
    """--kit <module>: {module, prefix, sids (the sorts already drawn with it, this one excepted)} or None"""
    k = (ctx.st.get('kit') or '').strip()
    if not k:
        return None
    mod = os.path.basename(k if k.endswith('.js') else k + '.js')
    p = '%s/app/%s' % (ctx.ch, mod)
    if not os.path.exists(p):
        raise StepFailed('--kit %s: app/%s not found in the working copy' % (k, mod))
    names = kit_names(open(p, encoding='utf-8', errors='replace').read())
    prefix = ctx.st.get('kit_prefix') or kit_prefix(names)
    sids = [x.strip() for x in (ctx.st.get('kit_sids') or '').split(',') if x.strip()] or kit_sorts(ctx, prefix, names)
    return {'module': mod, 'prefix': prefix, 'sids': [x for x in sids if x != ctx.sid]}


def kit_text(ctx):
    ki = kit_info(ctx)
    if not ki:
        return ('Une pièce de kit absente (couronne, rosette, grappe...) : générique et paramétrée, dans app/y3-<famille>.js, jamais dans y3.js. Si tu touches au moteur : '
                'l\'anémone reste à 0,00 % (fleur/img.py diff) et rtest reste IDENTIQUE.')
    return ('Sorte du kit app/%s (préfixe %s) : étends cette pièce, sans changer le rendu des sortes déjà faites avec elle (%s) : leur planche reste à 0,00 %% et '
            'leur rtest IDENTIQUE (contrôlés aux témoins). Tout nom nouveau de la pièce garde le préfixe %s ; ce qui ne sert qu\'à cette sorte va dans sa fiche. '
            'En bouquet, la tête nouvelle se place dans la boîte de l\'ancien dessin (comme svSpdKeepBox, app/y3-spathe.js). L\'anémone reste à 0,00 %%.'
            % (ki['module'], ki['prefix'] or '?', ', '.join(ki['sids']) or 'aucune trouvée', ki['prefix'] or 'de la famille'))


def kit_query(k):
    return 'grid=1&sid=%s&st=.2:0,.75:0,1:0,1:.6&view=2,0,7&D=140&det=1&seed=%d' % (k, SEED)


def sku_dump(ctx, when):
    """skudump_p.sh: the shop's products in order (sku;id;sid;...) -> refcache/<sid>/temoins/sku-<when>.csv; [[sku, id, ...]]"""
    need_servers(ctx)
    ramwait(ctx, 'skudump ' + when)
    run_cmd(ctx, [sh_exe(), 'mkapp.sh'], 'sku-build-' + when, timeout=600, quiet=True)  # skudump reads demo7.html
    tag = 'pipe-%s-%s' % (ctx.sid, when)
    c, t = run_cmd(ctx, [sh_exe(), 'fleur/skudump_p.sh', tag], 'skudump-' + when, timeout=1500)
    if ctx.dry:
        return []
    src = '%s/refcache/sku-%s.csv' % (ctx.ch, tag)
    lines = open(src, encoding='utf-8', errors='replace').read().splitlines() if os.path.exists(src) else []
    rows = [ln.split(';') for ln in lines[1:] if ln.count(';') >= 2]
    if not rows:
        raise StepFailed('skudump_p.sh gave no product (%s)' % ((t.strip().splitlines() or [''])[-1][:100]))
    os.makedirs(ctx.rc + '/temoins', exist_ok=True)
    shutil.copyfile(src, '%s/temoins/sku-%s.csv' % (ctx.rc, when))
    return rows


def sku_moved(before, after):
    """the SKU numbers whose product changed (a colourway added at the end, late:N, is not a move)"""
    A = {r[0]: r[1] for r in after}
    return ['%s: %s -> %s' % (r[0], r[1], A.get(r[0], 'absent')) for r in before if A.get(r[0]) != r[1]]


def witness_before(ctx):
    """before the modeller touches app/: the shop's SKU dump and, for a kit sort, a sheet of each sort already drawn with the kit (taken once)"""
    d = ctx.rc + '/temoins'
    if ctx.dry or not os.path.exists(d + '/sku-avant.csv'):
        sku_dump(ctx, 'avant')
    ki = kit_info(ctx)
    for k in (ki or {}).get('sids', []):
        dst = '%s/kit-avant-%s.png' % (d, k)
        if ctx.dry or not os.path.exists(dst):
            ok, m, t = shot(ctx, 'kit_%s' % slug(k), kit_query(k), 'kit-avant-' + k)
            if ctx.dry:
                continue
            if not ok:
                raise StepFailed('kit witness %s: no render before the modelling (%s)' % (k, (t.strip().splitlines() or [''])[-1][:80]))
            os.makedirs(d, exist_ok=True)
            shutil.copyfile('%s/fleur/out/kit_%s.png' % (ctx.ch, slug(k)), dst)


# ---------------------------------------------------------------------------------------------------------------- comparaison and juge

PLANT_CELL = 900  # the plant pairs' render: svtest's plant cell in px (the snap is twice as wide), so that a leaf or a junction crop keeps its detail
PAIRS = [  # BONNES-PRATIQUES 9.2 and 9.3b: a kept photo and the render at the same angle and the same stage (want: tag sets, best first)
    {'k': 'face', 'label': 'tête ouverte de face', 'want': [['stade:ouvert', 'vue:face'], ['stade:ouvert'], ['stade:entrouvert', 'vue:face']], 'st': '.85:0', 'view': 0, 'D': 600},
    {'k': 'trois-quarts', 'label': 'tête ouverte de trois-quarts', 'want': [['stade:ouvert', 'vue:trois-quarts'], ['vue:trois-quarts'], ['stade:entrouvert', 'vue:trois-quarts']],
     'st': '.85:0', 'view': 2, 'D': 600},
    {'k': 'profil', 'label': 'tête ouverte de profil', 'want': [['stade:ouvert', 'vue:profil'], ['vue:profil'], ['stade:entrouvert', 'vue:profil']], 'st': '.85:0', 'view': 7, 'D': 600},
    {'k': 'bouton', 'label': 'bouton', 'want': [['stade:bouton'], ['organe:bourgeon']], 'st': '.2:0', 'view': 7, 'D': 600, 'kind': 'bud', 'op': '.2'},
    {'k': 'fane-1', 'label': 'déclin (fané .6)', 'want': [['stade:declin'], ['stade:fane']], 'st': '1:.6', 'view': 2, 'D': 600, 'op': '1'},
    {'k': 'fane-2', 'label': 'fané avancé (.9)', 'want': [['stade:fane'], ['stade:declin']], 'st': '1:.9', 'view': 2, 'D': 600, 'op': '1'},
    # the plant pairs share one plant=1 render (loc=1: svtStem says where the stem and the leaves are): the whole stem, then the render cropped
    # to a leaf and to a stem junction at the photo's framing (P5); a whole plant is compared to a whole plant only (no fallback on a stem close-up)
    {'k': 'plante', 'label': 'plante entière (tige coupée, feuilles)', 'want': [['organe:plante']], 'plant': 1},
    {'k': 'feuille', 'label': 'feuille, face du dessus, cadrée comme la photo (la plus grande feuille du rendu)', 'want': [['organe:feuille-dessus']], 'plant': 1,
     'crop': 'feuille'},
    {'k': 'tige', 'label': 'tige et jonction (nœud, attache d\'une feuille), cadrées comme la photo', 'want': [['organe:noeud'], ['organe:tige']], 'plant': 1, 'crop': 'tige'},
    {'k': 'gros-plan', 'label': 'gros plan D 800 d\'une tête ouverte', 'want': [['stade:ouvert', 'vue:face'], ['stade:ouvert', 'vue:trois-quarts'], ['stade:ouvert']],
     'st': '.85:0', 'view': 0, 'D': 800},
]


# the grid views of the pairs that differ by form family (svtest's grid VIEWS: 7 = [0,.97,.24] an upright axis, 8 = [.97,-.17,.17] a side view).
# Journals: an orchid's true profile is view 8, view 7 is not a profile for it (phalaenopsis « Trous », tour v2-6); the anthurium's profile is
# unreadable at view 7 (spathes tour 3: views 0, 4, 8). A sort may override any pair's view: --views "profil:8,bouton:8" (kept in pipe-state.json).
VIEWS_FAMILY = {'orchidee': {'profil': 8, 'bouton': 8}, 'spathe': {'profil': 8, 'bouton': 8}}
FAMILY_ALIAS = {'orchidee': 'orchidee', 'orchidees': 'orchidee', 'orchid': 'orchidee', 'orchidaceae': 'orchidee', 'spathe': 'spathe', 'spathes': 'spathe', 'araceae': 'spathe'}
GENUS_FAMILY = {'phalaenopsis': 'orchidee', 'cymbidium': 'orchidee', 'dendrobium': 'orchidee', 'oncidium': 'orchidee', 'vanda': 'orchidee', 'cattleya': 'orchidee',
                'paphiopedilum': 'orchidee', 'miltonia': 'orchidee', 'anthurium': 'spathe', 'zantedeschia': 'spathe', 'spathiphyllum': 'spathe'}


def view_family(ctx):
    """the form family whose pair views apply: --family, else the kit module (y3-orchidee.js -> orchidee), else the genus; '' when none"""
    fam = norm(ctx.st.get('family') or '').replace(' ', '-')
    if fam in FAMILY_ALIAS:
        return FAMILY_ALIAS[fam]
    kit = re.sub(r'^y3-|\.js$', '', os.path.basename((ctx.st.get('kit') or '').strip()))
    if kit in FAMILY_ALIAS:
        return FAMILY_ALIAS[kit]
    return GENUS_FAMILY.get(norm(ctx.genus), '')


def parse_views(s):
    """--views "profil:8,bouton:8" (or a dict) -> {pair key: view index}"""
    if isinstance(s, dict):
        return {str(k): int(v) for k, v in s.items()}
    out = {}
    for it in (s or '').split(','):
        k, _, v = it.partition(':')
        if k.strip() and v.strip().lstrip('-').isdigit():
            out[k.strip()] = int(v)
    return out


def pair_views(ctx):
    """{pair key: grid view} of the head pairs: PAIRS, then the family's table, then the sort's own override; and where each came from"""
    v = {P['k']: P['view'] for P in PAIRS if 'view' in P}
    src = {k: 'PAIRS' for k in v}
    fam = view_family(ctx)
    for k, x in VIEWS_FAMILY.get(fam, {}).items():
        v[k], src[k] = x, 'famille ' + fam
    for k, x in parse_views(ctx.st.get('views')).items():
        if k in v:
            v[k], src[k] = x, 'sorte'
    return v, src


def kept_tags(x):
    out = set()
    for t in x.get('tags', []):
        fam, _, v = t.partition(':')
        fam = fam.strip().lower()
        if fam == 'coloris':
            out.add('coloris:' + norm(v))
        elif fam in REFS_MIN:
            v = norm_tag(v)
            out.add('%s:%s' % (fam, 'bourgeon' if fam == 'organe' and v == 'bouton' else v))
    return out


def cw_names(c):
    """the names a colourway answers to on a photo's coloris: tag (normalised: its catalogue id and its cultivar)"""
    return {n for n in (norm(c.get('cultivar')), norm(c.get('id'))) if n}


def photo_cws(x):
    """the colourways a kept photo is tagged with (coloris:<name>, normalised)"""
    return {t[8:] for t in kept_tags(x) if t.startswith('coloris:')}


def pair_plan(ctx, info=None):
    """one kept photo per pair (the bouquet's first colourway preferred, a photo used once when possible) and the render that answers it.
    P7: only photos of a group the sort compares to, with a pair copy of PAIR_SHORT px or more (p<NNN>.jpg); a coloris: photo the colour audit
    put out stays out of that colourway. ctx.pair_gaps says why a missing pair has no photo."""
    K0 = jload(ctx.rc + '/keep.json', []) or []
    info = pair_photos(ctx) if info is None else info
    audit = jload(ctx.rc + '/coloris-photos.json', {}) or {}
    K, unusable = [], {}
    for x in K0:
        ok_, why_ = pair_eligible(ctx, x, info)
        if ok_:
            K.append(x)
        else:
            unusable[x.get('i')] = why_
    cws = jload(ctx.rc + '/coloris.json', []) or []
    cw = cws[0]['id'] if cws else ''
    first = cw_names(cws[0]) if cws else set()
    full = int(getattr(ctx.a, 'full', 40) or 40)
    views, vsrc = pair_views(ctx)
    used, plan, missing = {}, [], []
    ctx.pair_gaps = {}
    pfile = lambda x: (info.get(str(x.get('i'))) or {}).get('file') or '%s/t%03d.jpg' % (ctx.rel, int(x.get('i', 0)))
    for P in PAIRS:
        best = None
        for alt in P['want']:
            cands = [x for x in K if set(alt) <= kept_tags(x)]
            if cands:
                same = lambda x: any(cw_photo_ok(audit, x, n) for n in photo_cws(x) & first)  # the same colourway: equal names, never a substring
                cands.sort(key=lambda x: (used.get(x.get('i'), 0), not same(x)))
                best = cands[0]
                break
        if not best:
            missing.append(P['k'])
            near = ['%s (%s)' % (x.get('i'), unusable[x.get('i')]) for x in K0 if x.get('i') in unusable and any(set(alt) <= kept_tags(x) for alt in P['want'])]
            ctx.pair_gaps[P['k']] = ('kept photos that fit but cannot serve: ' + '; '.join(near[:4])) if near else (
                'no kept photo tagged %s' % ' or '.join('+'.join(alt) for alt in P['want']))
            continue
        used[best.get('i')] = used.get(best.get('i'), 0) + 1
        name = 'cmp_%s_%s' % (slug(ctx.sid)[:24], 'plante' if P.get('plant') else P['k'])
        if P.get('plant'):  # one render for the plant pairs, large (cell 900: 1 800 px wide), with the stem and leaf boxes (loc=1)
            q, cell = 'plant=1&sid=%s&cw=%s&st=1:0&axv=1&full=%d&det=1.5&cell=%d&loc=1&seed=%d' % (ctx.sid, cw, full, PLANT_CELL, SEED), ('loc:' + P['crop']) if P.get('crop') else ''
        else:
            q, cell = 'grid=1&sid=%s&cws=%s&st=%s&view=%d&D=%d&det=1.5&seed=%d' % (ctx.sid, cw, P['st'], views[P['k']], P['D'], SEED), '0,0@%d' % P['D']
        plan.append({'k': P['k'], 'label': P['label'], 'photo': best.get('i'), 'title': best.get('title'), 'page': best.get('page'), 'tags': best.get('tags'),
                     'view': views.get(P['k']), 'view_from': vsrc.get(P['k']),
                     'vu': best.get('m'), 'thumb': pfile(best), 'query': q, 'name': name, 'render': 'fleur/out/%s.png' % name,
                     'cell': cell, 'kind': P.get('kind', 'cup'), 'op': P.get('op', '.85'), 'cw': cw,
                     'png': '%s/comparaison/%s.png' % (ctx.rel, P['k']), 'txt': '%s/comparaison/%s.txt' % (ctx.rel, P['k'])})
    # BONNES-PRATIQUES 9.3c (owner, 2026-10-18, cymbidium): every colourway with a photo of its own variety is compared to THAT photo
    # (tip shape, colour zones, translucency, its own heart), face on and open; up to --cw-pairs of them (10 by default)
    ncw, absent = int(getattr(ctx.a, 'cw_pairs', 10) or 10), []
    for c in cws[:ncw * 3]:
        if sum(1 for q in plan if q['k'].startswith('cw-')) >= ncw:
            break
        names = cw_names(c)
        own = [x for x in K if any(cw_photo_ok(audit, x, n) for n in photo_cws(x) & names)]
        if not own:  # said, never skipped in silence: the owner decides (a named photo to find, or no pair for it)
            off = [str(x.get('i')) for x in K0 if photo_cws(x) & names]
            absent.append('coloris %s (%s) : aucune photo gardée balisée `coloris:` %s%s ; pas de paire cw- (ajouter une photo nommée de la variété à refs, ou dire que la paire est inutile)'
                          % (c.get('id'), c.get('cultivar') or 'nom générique', ' ou '.join(sorted(names)) or '-',
                             (' qui serve (photos %s : groupe, taille ou couleur, voir pair-photos.json et coloris-photos.json)' % ', '.join(off)) if off else ''))
            continue
        own.sort(key=lambda x: (not ({'stade:ouvert', 'vue:face'} <= kept_tags(x)), used.get(x.get('i'), 0)))
        best, k = own[0], 'cw-' + slug(str(c.get('id')))[:20].strip('-')
        name = 'cmp_%s_%s' % (slug(ctx.sid)[:24], k)
        plan.append({'k': k, 'label': 'coloris %s contre la photo de sa variété (pointes, zones de couleur, translucidité, cœur)' % c.get('id'),
                     'photo': best.get('i'), 'title': best.get('title'), 'page': best.get('page'), 'tags': best.get('tags'), 'vu': best.get('m'),
                     'thumb': pfile(best), 'name': name, 'render': 'fleur/out/%s.png' % name,
                     'query': 'grid=1&sid=%s&cws=%s&st=.85:0&view=0&D=600&det=1.5&seed=%d' % (ctx.sid, c.get('id'), SEED), 'cell': '0,0@600',
                     'kind': 'cup', 'op': '.85', 'cw': c.get('id'), 'png': '%s/comparaison/%s.png' % (ctx.rel, k), 'txt': '%s/comparaison/%s.txt' % (ctx.rel, k)})
    set_questions(ctx, 'paires-coloris', 'Coloris sans paire photo/rendu (comparaison, 9.3c)', absent)
    return plan, missing


def write_pairs(ctx, plan):
    """comparaison/pairs.json, pairs.md (what the modeller and the judge read) and refaire.sh (redoes some or all pairs)"""
    d = ctx.rc + '/comparaison'
    if ctx.dry:
        for p in plan:
            say('  [dry] pair %-12s photo %s (%s) vs %s%s' % (p['k'], p['photo'], ' '.join(p['tags'] or []), p['query'],
                ' (view %s: %s)' % (p['view'], p['view_from']) if p.get('view_from') and p['view_from'] != 'PAIRS' else ''))
        return
    os.makedirs(d, exist_ok=True)
    jsave(d + '/pairs.json', plan)
    L = ['# Paires de comparaison de %s' % ctx.sid, '', 'Photo à gauche, rendu à droite (`<clé>.png`), mesures de silhouette dans `<clé>.txt`. Refaire : `sh %s/comparaison/refaire.sh [clé...]`.' % ctx.rel,
         'Photos de tiers : elles restent dans refcache.', '', '| clé | ce qui se compare | photo | étiquettes | rendu |', '|---|---|---|---|---|']
    for p in plan:
        L.append('| %s | %s | %s (%s) | %s | `%s` |' % (p['k'], p['label'], p['thumb'], p['page'], ' '.join(p['tags'] or []), p['query']))
    open(d + '/pairs.md', 'w', encoding='utf-8', newline='\n').write('\n'.join(L) + '\n')
    rw = os.environ.get('PIPE_RAMWAIT', RAMWAIT)
    S = ['#!/bin/sh', '# refaire.sh [paire...]: redoes the comparison pairs of %s (written by fleur/pipe.py; never edit). Render through fleur/shot_p.sh (seed %d),' % (ctx.sid, SEED),
         '# then python fleur/img.py pair photo / render -> %s/comparaison/<paire>.png and .txt. Without argument: every pair.' % ctx.rel,
         'cd "$(dirname "$0")/../../.." || exit 1']
    if rw:
        S.append('sh "%s" >/dev/null' % rw)
    S.append('box() { python -c "import sys;from PIL import Image;print(\'0,0,%d,%d\'%Image.open(sys.argv[1]).size)" "$1"; }')
    # a render is reused while it is newer than every app/*.js and pilote/svtest.js and was made by the same query (<render>.q): the plant pairs
    # share one render, and redoing a pair whose drawing did not change costs no Chrome
    S.append('fresh() { [ -f "$1" ] && [ "$(cat "${1%.png}.q" 2>/dev/null)" = "$2" ] || return 1; for f in app/*.js pilote/svtest.js; do [ "$f" -nt "$1" ] && return 1; done; return 0; }')
    for p in plan:
        o, t = p['png'], p['txt']
        cell = p['cell'] or '$(box %s)' % p['render']
        if cell.startswith('loc:'):  # a crop of the plant render where svtest located the leaf or the junction (pipe.py locbox)
            cell = '$(python fleur/pipe.py locbox %s %s)' % (p['render'][:-4] + '.json', cell[4:])
        log = '%s/comparaison/%s.log' % (ctx.rel, p['k'])
        S += ['p_%s() {' % p['k'].replace('-', '_'),
              '  rm -f "%s" "%s"' % (o, t),
              '  if ! fresh %s "%s"; then' % (p['render'], p['query']),
              '    rm -f %s "%s"; sh fleur/shot_p.sh %s "%s" > "%s" 2>&1' % (p['render'], p['render'][:-4] + '.q', p['name'], p['query'], log),
              '    if grep -q "PAS D" "%s" || [ ! -f %s ]; then echo "%s: PAS D\'IMAGE $(grep -m1 "ERREUR JS" "%s")"; return 1; fi' % (log, p['render'], p['k'], log),
              '    echo "%s" > "%s"' % (p['query'], p['render'][:-4] + '.q'),
              '  fi',
              '  python fleur/img.py pair %s "$(box %s)" %s "%s" --kind %s --op %s --h %d --w %d --brief %s/brief.md --out "%s" > "%s" 2>&1' % (
                  p['thumb'], p['thumb'], p['render'], cell, p['kind'], p['op'], PAIR_H, PAIR_W, ctx.rel, o, t),
              '  echo "%s: $(tail -3 "%s" | tr \'\\n\' \' \')"' % (p['k'], t),
              '}']
    S.append('for k in ${*:-%s}; do "p_$(echo "$k" | tr - _)" || echo "$k: ERREUR"; done' % ' '.join(p['k'] for p in plan))
    open(d + '/refaire.sh', 'w', encoding='utf-8', newline='\n').write('\n'.join(S) + '\n')


def run_pairs(ctx, plan):
    """makes every pair (renders through the gate): sh refaire.sh"""
    need_servers(ctx)
    ramwait(ctx, 'comparison pairs')
    c, t = run_cmd(ctx, [sh_exe(), '%s/comparaison/refaire.sh' % ctx.rel], 'comparaison-pairs', timeout=3600)
    return t


RUN_PAIRS = run_pairs  # the selftest puts a stand-in here (no Chrome)


def table_rows(p):
    """the « contrôle 9.2 » table of etat-comparaison.md: {pair key: {verdict, ecart}} (first cell = the key)"""
    out = {}
    try:
        lines = open(p, encoding='utf-8', errors='replace').read().splitlines()
    except Exception:
        return out
    for ln in lines:
        if not ln.strip().startswith('|'):
            continue
        cells = [c.strip().strip('*`').strip() for c in ln.strip().strip('|').split('|')]
        k = norm(cells[0]).replace(' ', '-') if cells else ''
        if len(cells) >= 2 and k and k not in out and not set(cells[1]) <= set('-: '):
            out[k] = {'verdict': norm(cells[1]), 'ecart': ' | '.join(cells[2:]).strip(), 'raw': ln.strip()}
    return out


def app_mtime(ctx):
    return max([os.path.getmtime(f) for f in glob.glob(ctx.ch + '/app/*.js')] or [0])


def code_fp(ctx):
    """sha1 of the drawing code a verdict is about: every app/*.js and pilote/svtest.js of the copy (path and content)"""
    h = hashlib.sha1()
    for f in sorted(glob.glob(ctx.ch + '/app/*.js')) + [ctx.ch + '/pilote/svtest.js']:
        if os.path.exists(f):
            h.update(fwd(os.path.relpath(f, ctx.ch)).encode() + b'\0' + open(f, 'rb').read() + b'\0')
    return h.hexdigest()


def judged_code(ctx):
    """(ok, why): the judge accepted the sort and the code is still the one it judged (fingerprint taken at its ok)"""
    j = ctx.st['steps'].get('juge', {})
    if j.get('status') != 'done':
        return False, 'the judge has not accepted this sort (step juge %s)' % j.get('status', '-')
    if not j.get('fp'):
        return False, 'no code fingerprint was recorded at the judge\'s ok: run --from juge'
    fp = code_fp(ctx)
    if fp != j['fp']:
        return False, 'app/*.js or pilote/svtest.js changed since the judge\'s ok (fingerprint %s, now %s): run --from comparaison' % (j['fp'][:10], fp[:10])
    return True, ''


def check_comparaison(ctx, plan, ko_file=None, reads=True):
    """every pair present (PNG not empty), made after the last change of app/, looked at by the modeller; the table complete (ok or the gap);
    after a judge's ko: the drawing changed and the table was rewritten since"""
    why = []
    at = app_mtime(ctx)
    for p in plan:
        f = '%s/%s' % (ctx.ch, p['png'])
        if not os.path.exists(f) or os.path.getsize(f) == 0:
            why.append('%s: pair missing (sh %s/comparaison/refaire.sh %s)' % (p['k'], ctx.rel, p['k']))
        elif os.path.getmtime(f) < at:
            why.append('%s: pair older than the last change in app/ (redo it)' % p['k'])
        elif reads and not ctx.read_by('comparaison', p['png']):
            why.append('%s: pair never looked at (Read %s)' % (p['k'], p['png']))
    etat = ctx.rc + '/etat-comparaison.md'
    rows = table_rows(etat)
    for p in plan:
        r = rows.get(p['k'])
        if not r:
            why.append('%s: no line in the table of etat-comparaison.md' % p['k'])
        elif r['verdict'] != 'ok' and not (r['ecart'] or len(r['verdict']) > 3):
            why.append('%s: line without verdict nor gap' % p['k'])
    if ko_file and os.path.exists(ko_file):
        kt = os.path.getmtime(ko_file)
        if at <= kt:
            why.append('the judge said ko and nothing changed in app/ since')
        if not os.path.exists(etat) or os.path.getmtime(etat) <= kt:
            why.append('the table was not rewritten after the judge')
    return (not why), '; '.join(why[:12])


def step_comparaison(ctx, ko=None, trip=0):
    """Python makes the photo/render pairs; then the modeller (Opus) looks at each, corrects the drawing, redoes the pairs and writes the table"""
    ensure_docs(ctx)
    plan, missing = pair_plan(ctx)
    if missing:
        msg = 'no kept photo for the pairs %s: complete the refs first (python fleur/pipe.py run %s --from refs)' % (', '.join(missing), ctx.sid)
        if not ctx.dry:
            raise StepFailed(msg)
        say('  [dry] ' + msg)
    write_pairs(ctx, plan)
    kof = None
    if ko:
        kof = '%s/comparaison/ko-%d.json' % (ctx.rc, trip)
        jsave(kof, ko)
    RUN_PAIRS(ctx, plan)
    ctx.reads['comparaison'] = set()  # each round looks at the pairs again
    extra = {'pairs': '%s/comparaison/pairs.md' % ctx.rel, 'refaire': '%s/comparaison/refaire.sh' % ctx.rel,
             'ko': '%s/comparaison/ko-%d.json' % (ctx.rel, trip) if ko else '-'}
    res, fin = model_loop(ctx, 'comparaison', 'comparaison', 'opus', READ + ['Write', 'Edit'] + SAFE_BASH, int(getattr(ctx.a, 'relays', 4) or 4),
                          lambda: check_comparaison(ctx, plan, kof), extra=extra, must_read=[bp_rel(ctx)])
    if res == 'blocked':
        raise StepFailed('comparaison blocked by the modeller: %s' % (fin.get('question') or fin.get('note') or fin))
    if ctx.dry:
        return {'status': 'done', 'msg': 'dry: %d pairs planned%s' % (len(plan), ', missing on the disk: ' + ', '.join(missing) if missing else '')}
    ok, why = check_comparaison(ctx, plan, kof)
    rows = table_rows(ctx.rc + '/etat-comparaison.md')
    nok = sum(1 for p in plan if rows.get(p['k'], {}).get('verdict') == 'ok')
    return {'status': 'done' if res == 'done' and ok else 'failed', 'trip': trip, 'checks': {'pairs': len(plan), 'ok': nok},
            'msg': 'comparaison %s%s: %d pairs, %d ok, %d with a gap stated%s' % (res, ' (after the judge, round trip %d)' % trip if trip else '', len(plan), nok, len(plan) - nok,
                                                                                '' if ok else '; check: ' + why)}


def judge_once(ctx, plan, trips, k):
    prev = ('Le juge précédent avait refusé : %s/comparaison/ko-%d.json. Vérifie d\'abord ces points, sans t\'y limiter.' % (ctx.rel, trips)) if trips else '-'
    p = prompt_text('juge', **ctx.sub(pairs='%s/comparaison/pairs.md' % ctx.rel, table='%s/etat-comparaison.md' % ctx.rel, prev=prev))
    ctx.reads['juge'] = set()
    r = call_model(ctx, 'juge', 't%d.%d' % (trips, k), 'opus', p, READ + ['Bash(python fleur/img.py *)'], turns=JUGE_TURNS)
    if ctx.dry:
        return {'verdict': 'ok', 'ko': [], 'issues': [], 'dry': True}
    fin = r.get('final') or {}
    verdict = norm(str(fin.get('verdict') or ''))
    key = lambda s: norm(str(s or '')).replace(' ', '-')
    noted = {key(x.get('paire')): x for x in fin.get('lignes') or [] if isinstance(x, dict)}
    ko = [x for x in fin.get('ko') or [] if isinstance(x, dict)]
    ko += [{'paire': kk, 'raison': x.get('raison') or 'ko'} for kk, x in noted.items() if norm(str(x.get('note') or '')) != 'ok' and not any(key(y.get('paire')) == kk for y in ko)]
    issues = []
    if verdict not in ('ok', 'ko'):
        issues.append('no verdict (%s)' % r.get('subtype'))
    unseen = [p['k'] for p in plan if not ctx.read_by('juge', p['png'])]
    if unseen:
        issues.append('pairs not looked at: ' + ', '.join(unseen))
    unnoted = [p['k'] for p in plan if p['k'] not in noted]
    if unnoted:
        issues.append('pairs not noted: ' + ', '.join(unnoted))
    if not ctx.read_by('juge', bp_rel(ctx)):  # like the modeller's must_read: the checklist is read in full by the judge too
        issues.append('BONNES-PRATIQUES.md never opened (Read %s in full first)' % bp_rel(ctx))
    # anti-anchoring: the modeller's table may be read only once every pair has been looked at (its verdicts come after the judge's own)
    seq = [x for x in r.get('reads') or []]
    tab = ctx.npath('%s/etat-comparaison.md' % ctx.rel)
    if tab in seq:
        first = {}
        for i, x in enumerate(seq):
            first.setdefault(x, i)
        early = [p['k'] for p in plan if first.get(ctx.npath(p['png']), len(seq)) > first[tab]]
        if early:
            issues.append('the modeller\'s table was read before the pairs %s were looked at (anchoring: judge every pair first)' % ', '.join(early[:6]))
    return {'verdict': 'ok' if verdict == 'ok' and not ko and not issues else 'ko', 'ko': ko, 'issues': issues, 'lignes': list(noted.values()), 'call': r.get('subtype')}


def judge(ctx, plan, trips):
    """the adversarial judge (a fresh Opus that is not the modeller, read-only): ok only if every pair was looked at, noted and found right;
    a judge that did not judge (no verdict, pairs unseen or unnoted) is asked once more, then it counts as ko (a doubt = ko)"""
    for k in (1, 2):
        v = judge_once(ctx, plan, trips, k)
        if not v['issues'] or ctx.dry:
            break
        say('  judge %d: %s' % (k, '; '.join(v['issues'])))
    v['ko'] = v['ko'] + [{'paire': '-', 'raison': 'le juge n\'a pas pu juger : ' + x} for x in v['issues']]
    if not ctx.dry:
        jsave('%s/comparaison/juge-%d.json' % (ctx.rc, trips), v)
    return v


def write_refusal(ctx, v, trips):
    p = '%s/comparaison/refus.md' % ctx.rc
    L = ['# Refus du juge : %s' % ctx.sid, '', 'Après %d aller(s)-retour(s) entre le juge et le modeleur, le juge refuse la sorte : pipe.py ne la déclare pas finie.' % trips, '',
         '| paire | raison |', '|---|---|'] + ['| %s | %s |' % (x.get('paire'), str(x.get('raison') or '').replace('|', '/')) for x in v['ko']]
    L += ['', 'Paires : `%s/comparaison/<clé>.png` ; verdicts : `juge-<n>.json` ; tableau du modeleur : `etat-comparaison.md`.' % ctx.rel,
          'Reprendre après correction : `python fleur/pipe.py run %s --from comparaison`.' % ctx.sid]
    open(p, 'w', encoding='utf-8', newline='\n').write('\n'.join(L) + '\n')
    return '%s/comparaison/refus.md' % ctx.rel


def step_juge(ctx):
    """ok -> done; ko -> comparaison with the ko list, then the judge again, --juge-tours round trips at most; then REFUSED (exit 2)"""
    s = ctx.st['steps'].get('juge', {})
    if s.get('refused') and not ctx.dry:
        return {'status': 'failed', 'refused': True, 'report': s.get('report'), 'trips': s.get('trips'),
                'msg': 'REFUSED earlier by the judge (%s): correct the drawing, then run --from comparaison' % s.get('report')}
    tours = getattr(ctx.a, 'juge_tours', None)
    tours = JUGE_TOURS if tours is None else int(tours)
    plan = jload(ctx.rc + '/comparaison/pairs.json', None)
    if not plan:
        if not ctx.dry:
            raise StepFailed('no comparison pairs: run --from comparaison')
        plan = pair_plan(ctx)[0]
    if not ctx.dry:
        ok, why = check_comparaison(ctx, plan, reads=False)
        if not ok:
            raise StepFailed('the comparison is not complete (%s): run --from comparaison' % why)
    trips = int(s.get('trips') or 0)
    if ctx.dry:
        say('  [dry] on ko: comparaison again with the ko list, %d round trips at most, then refusal (exit 2)' % tours)
    while True:
        v = judge(ctx, plan, trips)
        ctx.note('juge', trips=trips, last=v['verdict'])
        if v['verdict'] == 'ok':
            fp = code_fp(ctx)  # what was judged: planches and FINI refuse a code that changed since
            return {'status': 'done', 'trips': trips, 'fp': fp, 'msg': 'the judge accepts every pair (%d round trips; code %s)%s' % (trips, fp[:10], ' (dry)' if ctx.dry else '')}
        if trips >= tours:
            rep = write_refusal(ctx, v, trips)
            return {'status': 'failed', 'refused': True, 'trips': trips, 'report': rep,
                    'msg': 'REFUSED by the judge after %d round trips: %s; report %s' % (trips, '; '.join('%s %s' % (x.get('paire'), str(x.get('raison'))[:60]) for x in v['ko'][:4]), rep)}
        trips += 1
        ctx.note('juge', trips=trips)
        say('  judge: ko on %s: back to comparaison (round trip %d/%d)' % (', '.join(str(x.get('paire')) for x in v['ko'][:6]), trips, tours))
        r = step_comparaison(ctx, ko=v['ko'], trip=trips)
        ctx.note('comparaison', **{k: r[k] for k in ('status', 'msg') if k in r})
        if r['status'] != 'done':
            return {'status': 'failed', 'trips': trips, 'msg': 'comparaison after the judge (round trip %d) not finished: %s' % (trips, r['msg'])}


# ---------------------------------------------------------------------------------------------------------------- witnesses

def rtest_parse(txt):
    """{'stage vessel': 'IDENTIQUE' | 'DIFFERENT' | 'ERR'} from the page's rtest line (items separated by ' | ')"""
    out = {}
    for it in txt.split(' | '):
        m = re.match(r'\s*(\S+) (\S+) (IDENTIQUE|DIFFERENT|ERR)', it)
        if m:
            out['%s %s' % (m[1], m[2])] = m[3]
    return out


def rtest_run(ctx, rel_url, rcs, tag):
    """one rtest page (in the copy, or in the main atelier with rel_url ''), through the gate; {} when dry or unreadable"""
    ramwait(ctx, 'rtest ' + tag)
    url = '%s?rtest=1&rc=%s&sv=11&nc=%d' % (ctx.url('pilote/sv.html', main=not rel_url), ','.join(rcs), time.time())
    outp = 'fleur/out/%s.json' % tag
    c, t = run_cmd(ctx, [sh_exe(), 'ws/gate.sh', sh_exe(), 'ws/chrome1.sh', 'dom', url, outp], tag, timeout=1700, quiet=True)
    p = '%s/%s' % (ctx.ch, outp)
    return rtest_parse(open(p, encoding='utf-8', errors='replace').read()) if not ctx.dry and os.path.exists(p) else {}


def step_temoins(ctx):
    out = []
    ok = True
    # the build: mkapp.sh must say « app syntax ok »
    c, t = run_cmd(ctx, [sh_exe(), 'mkapp.sh'], 'temoin-build', timeout=600, quiet=True)
    c2, t2 = run_cmd(ctx, [sys.executable, 'pilote/mksv.py'], 'temoin-build-sv', timeout=600, quiet=True)
    if not ctx.dry:
        syn = 'app syntax ok' in t
        ok = ok and syn and not c2
        out.append('mkapp %s%s' % ('app syntax ok' if syn else 'WITHOUT "app syntax ok" (%s)' % (t.strip().splitlines() or [''])[-1][:80], '' if not c2 else ', mksv failed'))
    q = ''
    try:
        q = open(MAIN + '/fleur/out/base_q.txt', encoding='utf-8').read().strip().splitlines()[0]
    except Exception:
        out.append('anemone query (base_q.txt) not found')
        ok = False
    if q:
        good, m, text = shot(ctx, 'temoin_anem', q, 'temoin-anem')
        if ctx.dry:
            out.append('anemone dry')
        elif not good:
            ok = False
            out.append('anemone render failed')
        else:
            # the anemone's witness: base_v2.png once the copy holds the anemone merge (d227daa, colours remeasured), base_before.png before it
            v2 = subprocess.run(['git', 'merge-base', '--is-ancestor', 'd227daa', 'HEAD'], cwd=ctx.ch, capture_output=True).returncode == 0
            base = MAIN + '/fleur/out/' + ('base_v2.png' if v2 else 'base_before.png')
            c, t = run_cmd(ctx, [sys.executable, 'fleur/img.py', 'diff', 'fleur/out/temoin_anem.png', base], 'temoin-diff', timeout=120, quiet=True)
            mm = re.search(r'changed ([\d.]+)%', t)
            pct = float(mm.group(1)) if mm else None
            ok = ok and pct == 0.0
            out.append('anemone %s %% (%s)' % (pct if pct is not None else '?', os.path.basename(base)))
    # rtest = the bouquet's random stream with the SVG heads off and on (the composition must not move). The sort's own SKUs: IDENTIQUE, or
    # reported under the owner's policy (rtest_policy: a new drawing replacing an old one, --rtest-bouge); the kit's sorts must be IDENTIQUE;
    # the tulip witnesses must do no worse than in the main atelier (a failure already there is not the sort's)
    own = own_rc(ctx)
    pol, pwhy = rtest_policy(ctx)
    ki = kit_info(ctx)
    kit_rc = ['%s~%d:6' % (k, n) for k in (ki or {}).get('sids', []) for n in (0, 1)]
    wit = ['tulipe-simple~7:7', 'tulipe-simple~12:6']
    need_servers(ctx)
    r_own = rtest_run(ctx, ctx.rel_url, own, 'temoin-rtest') if own else {}
    r_kit = rtest_run(ctx, ctx.rel_url, kit_rc, 'temoin-rtest-kit') if kit_rc else {}
    r_wit = rtest_run(ctx, ctx.rel_url, wit, 'temoin-rtest-tulipes')
    r_ref = rtest_run(ctx, '', wit, 'temoin-rtest-principal') if ctx.rel_url else r_wit
    if not ctx.dry:
        nd_own = [k for k, v in r_own.items() if v != 'IDENTIQUE']
        nd_kit = [k for k, v in r_kit.items() if v != 'IDENTIQUE']
        worse = [k for k, v in r_wit.items() if v != 'IDENTIQUE' and r_ref.get(k) == 'IDENTIQUE']
        known = [k for k, v in r_wit.items() if v != 'IDENTIQUE' and r_ref.get(k) != 'IDENTIQUE']
        stop_own = nd_own if pol == 'strict' else [k for k, v in r_own.items() if v == 'ERR']
        ok = ok and bool(r_own) == bool(own) and not stop_own and bool(r_kit) == bool(kit_rc) and not nd_kit and not worse and bool(r_wit)
        out.append('rtest of the sort %d IDENTIQUE, %d different%s; tulip witnesses %d IDENTIQUE, %d different%s' % (
            len(r_own) - len(nd_own), len(nd_own), (' (%s%s)' % (', '.join(nd_own), '' if stop_own else '; reported, not blocking: ' + pwhy)) if nd_own else '',
            len(r_wit) - len(known) - len(worse), len(known) + len(worse),
            ' (%d already so in the main atelier%s)' % (len(known), '; WORSE: ' + ', '.join(worse) if worse else '') if known or worse else ''))
        if kit_rc:
            out.append('rtest of the kit sorts %d IDENTIQUE, %d different%s' % (len(r_kit) - len(nd_kit), len(nd_kit), ' (%s)' % ', '.join(nd_kit) if nd_kit else ''))
    # the kit sorts' sheets: unchanged to the pixel against the sheets taken before the modelling
    for k in (ki or {}).get('sids', []):
        before = '%s/temoins/kit-avant-%s.png' % (ctx.rc, k)
        good, m, text = shot(ctx, 'kit_%s' % slug(k), kit_query(k), 'kit-apres-' + k)
        if ctx.dry:
            continue
        if not os.path.exists(before) or not good:
            ok = False
            out.append('kit sort %s: %s' % (k, 'no sheet taken before the modelling' if not os.path.exists(before) else 'render failed'))
            continue
        shutil.copyfile('%s/fleur/out/kit_%s.png' % (ctx.ch, slug(k)), '%s/temoins/kit-apres-%s.png' % (ctx.rc, k))
        c, t = run_cmd(ctx, [sys.executable, 'fleur/img.py', 'diff', before, '%s/temoins/kit-apres-%s.png' % (ctx.rc, k)], 'kit-diff-' + k, timeout=120, quiet=True)
        mm = re.search(r'changed ([\d.]+)%', t)
        pct = float(mm.group(1)) if mm else None
        ok = ok and pct == 0.0
        out.append('kit sort %s %s %%' % (k, pct if pct is not None else '?'))
    # no SKU moved: the shop's products in the same order as before the modelling
    pb = ctx.rc + '/temoins/sku-avant.csv'
    if ctx.dry:
        sku_dump(ctx, 'apres')
    elif not os.path.exists(pb):
        ok = False
        out.append('no SKU dump before the modelling (temoins/sku-avant.csv, taken at the start of forme)')
    else:
        before = [ln.split(';') for ln in open(pb, encoding='utf-8', errors='replace').read().splitlines()[1:] if ln.count(';') >= 2]
        moved = sku_moved(before, sku_dump(ctx, 'apres'))
        ok = ok and not moved
        out.append('SKU: %d before, %s' % (len(before), 'none moved' if not moved else '%d MOVED (%s)' % (len(moved), ', '.join(moved[:4]))))
    b_ok, b_msg, m = budget(ctx, 'bud_' + ctx.sid)
    out.append(b_msg)
    return {'status': 'done' if (ok and b_ok) or ctx.dry else 'failed', 'msg': '; '.join(out), 'checks': m}


# ---------------------------------------------------------------------------------------------------------------- QA

def free_ram_gb():
    try:
        p = subprocess.run(['powershell', '-NoProfile', '-Command', "[string]::Format([cultureinfo]::InvariantCulture,'{0:F1}',(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB)"],
                           capture_output=True, text=True, timeout=60)
        return float(p.stdout.strip())
    except Exception:
        return 0.0


def step_qa(ctx):
    need_servers(ctx)
    for tag, argv in (('qa-build1', [sh_exe(), 'mkapp.sh']), ('qa-build2', [sh_exe(), 'mkqa.sh']), ('qa-build3', [sys.executable, 'pilote/mksv.py'])):
        c, t = run_cmd(ctx, argv, tag, timeout=600, quiet=True)
        if c and not ctx.dry:
            raise StepFailed('%s failed: %s' % (tag, (t.strip().splitlines() or [''])[-1][:120]))
    total, done, seed = int(getattr(ctx.a, 'qa_total', 30) or 30), 0, 0
    tot = {'floating': 0, 'under': 0, 'kinks': 0, 'bouquets': 0}
    minram, killed = 99.0, 0
    if ctx.dry:
        say('  [dry] ramwait.sh, then qawatch.sh by lots of 4 (4.5 GB free at least), %d bouquets in all, then the budget (measure)' % total)
        done = total
    while done < total:
        ramwait(ctx, 'QA lot')
        waits = 0
        ram = free_ram_gb()
        while ram < 4.5:
            waits += 1
            if waits > 6:
                raise StepFailed('free RAM stayed under 4.5 GB for 12 minutes (%.1f GB): resume with --from qa when the PC is free' % ram)
            say('  RAM %.1f GB, waiting 2 minutes (%d/6)' % (ram, waits))
            time.sleep(120)
            ram = free_ram_gb()
        lot = 4
        seed += 1
        url = ctx.url('lab/qa13.html') + '?run=composed&n=%d&seed=%d&inc=%s' % (lot, seed, ctx.sid)
        outp = 'pilote/qa_%s_%d.json' % (ctx.sid, seed)
        for attempt in (1, 2):
            c, t = run_cmd(ctx, [sh_exe(), 'ws/qawatch.sh', url, outp], 'qa-%d' % seed, timeout=1700, quiet=True)
            mm = re.search(r'min free RAM: ([\d.]+)', t)
            if mm:
                minram = min(minram, float(mm.group(1)))
            if 'KILLED' in t:
                killed += 1
                if attempt == 1:
                    say('  lot %d killed by the RAM guard, once more' % seed)
                    time.sleep(30)
                    continue
            break
        j = jload('%s/%s' % (ctx.ch, outp), None)
        if isinstance(j, dict) and isinstance(j.get('sum'), dict):
            s = j['sum']
            tot['floating'] += s.get('floating', 0)
            tot['under'] += s.get('under', 0)
            tot['bouquets'] += s.get('bouquets', 0)
            tot['kinks'] += sum(1 for r in j.get('rs', []) if r.get('K'))
        else:
            tot['missing'] = tot.get('missing', 0) + 1
        done += lot
        if seed > total:  # runs that give nothing must not loop for ever
            break
    b_ok, b_msg, m = budget(ctx, 'qa_' + ctx.sid)
    green = (tot['floating'] == 0 and tot['under'] == 0 and tot['kinks'] == 0 and tot['bouquets'] > 0 and not tot.get('missing') and b_ok) or ctx.dry
    return {'status': 'done' if green else 'failed', 'msg': '%s: %d bouquets, floating %d, under the vase %d, kinks %d, min free RAM %.1f GB, %d lots killed; %s'
            % ('GREEN' if green else 'RED', tot['bouquets'], tot['floating'], tot['under'], tot['kinks'], minram if minram < 99 else 0, killed, b_msg), 'checks': tot}


# ---------------------------------------------------------------------------------------------------------------- sheets

def step_planches(ctx):
    ok, why = judged_code(ctx)
    if not ok and not ctx.dry:
        raise StepFailed('%s: no sheet for the catalogue' % why)
    ids = cw_ids(ctx, 6)
    if not ids and not ctx.dry:
        raise StepFailed('no coloris.json: no sheet')
    dest = FC + '/catalogue/serre/pilote-printemps/sheets'
    full = int(getattr(ctx.a, 'full', 40) or 40)
    jobs = [('sku', 'grid=1&sid=%s&cws=%s&st=%s&view=2,0,3&D=110&seed=%d' % (ctx.sid, ','.join(ids), STAGES, SEED)),
            ('plante', 'plant=1&sid=%s&cw=%s&st=.1:0,.3:0,.6:0,1:0,1:.4,1:.75&axv=1&full=%d&seed=%d' % (ctx.sid, ids[0] if ids else '', full, SEED))]
    got = []
    for kind, q in jobs:
        name = 'pl_%s_%s' % (kind, ctx.sid)
        ok, m, text = shot(ctx, name, q, 'planche-' + kind)
        if ctx.dry:
            say('  [dry] copy fleur/out/%s.png -> %s/%s-%s-p1.png' % (name, dest, ctx.sid, kind))
            continue
        if not ok:
            raise StepFailed('sheet %s: no image (%s)' % (kind, (text.strip().splitlines() or [''])[-1][:100]))
        os.makedirs(dest, exist_ok=True)
        # never overwrite an earlier sheet: the next free -pN (p1 for the pipeline's first pass, p2... after retouches)
        k = 1
        while os.path.exists('%s/%s-%s-p%d.png' % (dest, ctx.sid, kind, k)):
            k += 1
        shutil.copyfile('%s/fleur/out/%s.png' % (ctx.ch, name), '%s/%s-%s-p%d.png' % (dest, ctx.sid, kind, k))
        got.append('%s-%s-p%d.png (%s el, %s KB)' % (ctx.sid, kind, k, (m or {}).get('el'), (m or {}).get('kb')))
    return {'status': 'done', 'msg': 'copied to %s: %s' % (dest, ', '.join(got) or 'dry')}


STEPFN = {'census': step_census, 'refs': step_refs, 'coloris': step_coloris, 'targets': step_targets, 'fiche': step_fiche, 'forme': step_forme, 'fit': step_fit,
          'plante': step_plante, 'finition': step_finition, 'comparaison': step_comparaison, 'juge': step_juge, 'temoins': step_temoins, 'qa': step_qa,
          'planches': step_planches}


# ---------------------------------------------------------------------------------------------------------------- the commands

COMMON_KEYS = {'sid', 'taxon', 'genus', 'family', 'rc', 'skus', 'ch', 'late'}
PROMPT_KEYS = {'census': {'n', 'batch', 'verdict'}, 'refs': {'task', 'sheets', 'missing', 'groupes'}, 'brief': set(), 'coloris': {'n', 'low', 'manual'}, 'fiche': {'relay', 'etat', 'fiche', 'schema'},
               'forme': {'relay', 'etat', 'kit', 'fiche', 'rtest'}, 'plante': {'relay', 'etat', 'fiche'}, 'finition': {'relay', 'etat'}, 'fit': {'part', 'space', 'out', 'summary'},
               'comparaison': {'relay', 'etat', 'pairs', 'ko', 'refaire'}, 'juge': {'pairs', 'table', 'prev'}}


def resolve_ch(name):
    if not name:
        return fwd(os.path.dirname(HERE))
    if os.path.isdir(name):
        return fwd(os.path.abspath(name))
    p = '%s/ch/%s' % (MAIN, name)
    if os.path.isdir(p):
        return p
    raise SystemExit('working copy not found: %s (give a name under %s/ch or a path)' % (name, MAIN))


def validate_prompts():
    bad = []
    for name, extra in PROMPT_KEYS.items():
        p = '%s/pipe/prompts/%s.md' % (HERE, name)
        if not os.path.exists(p):
            bad.append('%s.md missing' % name)
            continue
        t = open(p, encoding='utf-8').read()
        keys = set(re.findall(r'<<(\w+)>>', t))
        n = len(t.strip().splitlines())
        if keys - COMMON_KEYS - extra:
            bad.append('%s.md: unknown placeholders %s' % (name, sorted(keys - COMMON_KEYS - extra)))
        if n > 40:
            bad.append('%s.md has %d lines (40 at most)' % (name, n))
    return bad


def state_line(ctx, name):
    s = ctx.st['steps'].get(name, {})
    eq = sum(r.get('eq', 0) for r in ctx.bill.rows() if r['step'] == name)
    return '%-11s %-8s %7.0f k  %s' % (name, s.get('status', '-'), eq / 1e3, (s.get('msg') or '')[:120])


def cmd_run(a):
    ch = resolve_ch(a.ch)
    sid = a.sid
    rc = '%s/refcache/%s' % (ch, sid)
    os.makedirs(rc, exist_ok=True)
    st = jload(rc + '/pipe-state.json', None) or {'sid': sid, 'created': now(), 'steps': {}}
    if a.taxon:
        st['taxon'] = a.taxon
    if 'taxon' not in st:
        raise SystemExit('first run of %s: --taxon "<Genus species>" is needed' % sid)
    for k in ('family', 'genus', 'group', 'kit', 'kit_prefix', 'kit_sids', 'late', 'rtest_bouge', 'groupes'):
        if getattr(a, k, None):
            st[k] = getattr(a, k)
    if a.kavb:
        st['kavb'] = True
    if getattr(a, 'views', None):
        st['views'] = parse_views(a.views)
    sk = bouquet_skus(a, sid)
    if sk or 'skus' not in st:
        st['skus'] = sk
    if getattr(a, 'opus_effort', None):
        EFFORT['opus'] = a.opus_effort
    ctx = Ctx(sid, ch, a, st)
    if (not ctx.claude or not os.path.exists(ctx.claude)) and not ctx.dry:
        raise SystemExit('no Claude Code binary found (desktop application: %APPDATA%/Claude/claude-code/<version>/*/claude.exe); set PIPE_CLAUDE or --claude')
    st['claude'] = ctx.claude
    st['cap_M'] = a.cap
    names = list(STEPS)
    if getattr(a, 'skip_census', False) and st['steps'].get('census', {}).get('status') not in ('done', 'skipped'):
        # a census exists already: refcache/<sid>/census/census.json, or the catalogue's sources file (imported, read-only)
        if ctx.dry:
            say('[dry] --skip-census: census.json %s' % ('present' if os.path.exists(ctx.rc + '/census/census.json') else 'imported from catalogue/serre/sources/%s.json' % sid))
        else:
            try:
                msg = census_import(ctx)
            except StepFailed as e:
                raise SystemExit(str(e))
            c = check_census(ctx)
            ctx.note('census', status='skipped', msg='--skip-census: %s; %s' % (msg, c['msg']), ended=now())
    if a.only:
        todo = [a.only]
    else:
        start = a.from_ or next((n for n in names if st['steps'].get(n, {}).get('status') not in ('done', 'skipped')), None)
        if start is None:
            say('every step is done: nothing to run (use --from <step> to redo)')
            fin = None if ctx.dry else fini(ctx)
            if fin:
                say(fin[1])
                return 0 if fin[0] else 2
            return 0
        todo = names[names.index(start):]
        if a.from_ and not ctx.dry:
            for n in todo:
                st['steps'].pop(n, None)
        if getattr(a, 'skip_census', False) and todo and todo[0] == 'census':
            todo = todo[1:]
    bad = validate_prompts()
    if bad:
        raise SystemExit('prompts: ' + '; '.join(bad))
    priv = private_scripts(ctx)
    ki = kit_info(ctx) if st.get('kit') else None
    say('%s (%s): steps %s ; CLI %s ; Opus effort %s ; server port %d ; private %s ; cap %.1f M (measure) ; spent %.2f M%s%s' % (
        sid, st['taxon'], ' '.join(todo), os.path.basename(os.path.dirname(os.path.dirname(ctx.claude or ''))) or ctx.claude, EFFORT['opus'], port(), ','.join(priv) or '-',
        ctx.cap / 1e6, ctx.bill.total() / 1e6, ' ; kit %s (%s) with %s' % (ki['module'], ki['prefix'], ','.join(ki['sids']) or '-') if ki else '', ' ; DRY RUN' if ctx.dry else ''))
    if not ctx.dry and 'shot_p.sh' not in priv and any(n in todo for n in LOCKED):
        raise SystemExit('fleur/shot.sh not found in %s: no private copy fleur/shot_p.sh for the renders' % ch)
    slot = Lock(['pipe-1', 'pipe-2', 'pipe-3'], sid)
    if not ctx.dry:
        for n in os.listdir(LOCKS) if os.path.isdir(LOCKS) else []:
            if n.startswith('pipe-'):
                info = jload('%s/%s/info.json' % (LOCKS, n), {})
                if info.get('sid') == sid and info.get('pid') != os.getpid() and pid_alive(info.get('pid', 0)):
                    raise SystemExit('%s is already running (pid %s)' % (sid, info.get('pid')))
        if not slot.acquire(wait=False):
            say('three sorts are already running on this PC (ws/locks/pipe-1..3): try again later')
            return 4
    ctx.slot = slot
    code = 0
    try:
        for n in todo:
            st['current'] = n
            ctx.note(n, status='running', started=now())
            say('== %s' % n)
            ctx.held = get_lock(ctx, 'opus') if n in LOCKED else None
            try:
                res = STEPFN[n](ctx)
            except CapReached as e:
                ctx.note(n, status='capped', msg=str(e))
                say('CAP: %s. State kept; resume with: python fleur/pipe.py run %s --from %s --cap <M>' % (e, sid, n))
                code = 3
                break
            except StepFailed as e:
                res = {'status': 'failed', 'msg': str(e)}
            except Exception as e:
                import traceback
                open('%s/pipe-logs/error-%s.txt' % (ctx.rc, n), 'w', encoding='utf-8').write(traceback.format_exc())
                res = {'status': 'failed', 'msg': 'error %s: %s (pipe-logs/error-%s.txt)' % (type(e).__name__, e, n)}
            finally:
                if ctx.held:
                    ctx.held.release()
                    ctx.held = None
            res['ended'] = now()
            if ctx.dry and res.get('status') == 'failed':
                res['msg'] = 'KO (dry, on the disk as it is): ' + res.get('msg', '')
            ctx.note(n, **res)
            say('%s %s' % (res['status'].upper(), res.get('msg', '')))
            if res['status'] == 'failed' and not ctx.dry:
                if res.get('refused'):
                    say('REFUSED by the judge: the sort is NOT finished. Report: %s ; after correcting: python fleur/pipe.py run %s --from comparaison' % (res.get('report'), sid))
                else:
                    say('stopped. Fix the cause, then: python fleur/pipe.py run %s --from %s' % (sid, n))
                code = 2
                break
            if ctx.bill.total() >= ctx.cap and n != todo[-1]:
                say('CAP: %.2f M spent (cap %.1f M) after %s. State kept; resume with --cap <M>.' % (ctx.bill.total() / 1e6, ctx.cap / 1e6, n))
                code = 3
                break
    finally:
        slot.release()
    say('-- %s' % ' | '.join('%s %s' % (n, st['steps'].get(n, {}).get('status', '-')) for n in names))
    say('-- bill: %.2f M eq-Opus (cap %.1f M, a measure)' % (ctx.bill.total() / 1e6, ctx.cap / 1e6))
    if not ctx.dry:
        fin = fini(ctx)
        if fin:
            say(fin[1])
            code = code or (0 if fin[0] else 2)
    return code


def fini(ctx):
    """None while a step is not done; else (True, the FINI line) when the judge accepted THIS code, or (False, why not)"""
    st = ctx.st
    if not all(st['steps'].get(n, {}).get('status') in ('done', 'skipped') for n in STEPS) or st['steps'].get('juge', {}).get('status') != 'done':
        return None
    ok, why = judged_code(ctx)
    return (True, '-- FINI: %s accepted by the judge, witnesses and QA green' % ctx.sid) if ok else (False, '-- NOT FINISHED: ' + why)


def load_ctx(a):
    ch = resolve_ch(getattr(a, 'ch', None))
    st = jload('%s/refcache/%s/pipe-state.json' % (ch, a.sid), None)
    if st is None:
        raise SystemExit('no state for %s in %s' % (a.sid, ch))
    a.cap = st.get('cap_M', 40)
    return Ctx(a.sid, ch, a, st)


def cmd_status(a):
    ctx = load_ctx(a)
    say('%s (%s) in %s ; current %s ; updated %s' % (ctx.sid, ctx.taxon, ctx.ch, ctx.st.get('current'), ctx.st.get('updated')))
    say('%-11s %-8s %9s  %s' % ('step', 'status', 'eq-Opus', 'message'))
    for n in STEPS:
        say(state_line(ctx, n))
    say('bill %.2f M of %.1f M' % (ctx.bill.total() / 1e6, ctx.cap / 1e6))
    return 0


def cmd_bill(a):
    ctx = load_ctx(a)
    for line in ctx.bill.table():
        say(line)
    say('cap %.1f M, spent %.2f M (%.0f %%)' % (ctx.cap / 1e6, ctx.bill.total() / 1e6, 100 * ctx.bill.total() / ctx.cap))
    return 0


def loc_box(loc, kind):
    """the crop of a plant render (svtest &loc=1, first cell) for a pair: 'feuille' = the biggest leaf, padded 6 %; 'tige' = a square on the stem
    where the biggest leaf joins it (the stem point nearest to the leaf's box), 12 stem widths and 14 to 30 % of the stem's height wide;
    clamped to the snap. Returns (x0, y0, x1, y1) or raises ValueError with the reason"""
    cells = (loc or {}).get('cells') or []
    if not cells:
        raise ValueError('no located stem in the render (loc=1 needs a plant sheet with full=<cm>: svtStem)')
    c, (W, H) = cells[0], (loc.get('size') or [10 ** 6, 10 ** 6])
    leaves = sorted(c.get('leaves') or [], key=lambda b: -(b[2] - b[0]) * (b[3] - b[1]))
    clamp = lambda b: (max(0, int(b[0])), max(0, int(b[1])), min(W, int(b[2])), min(H, int(b[3])))
    if kind == 'feuille':
        if not leaves:
            raise ValueError('no leaf located (svtStem draws the leaves of STEML / GHI[sid].basal; a leaf drawn elsewhere is not located)')
        b = leaves[0]
        px, py = .06 * (b[2] - b[0]), .06 * (b[3] - b[1])
        return clamp((b[0] - px, b[1] - py, b[2] + px, b[3] + py))
    st = c.get('stem') or []
    if not st:
        raise ValueError('no stem midline located')
    ys = [p[1] for p in st]
    if leaves:
        b = leaves[0]
        cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
        x, y = min(st, key=lambda p: (p[0] - cx) ** 2 + (p[1] - cy) ** 2)
    else:
        x, y = st[len(st) // 2]
    h = max(ys) - min(ys)
    side = min(max(12 * float(c.get('w') or 4), .14 * h), .3 * h)
    return clamp((x - side / 2, y - side / 2, x + side / 2, y + side / 2))


def cmd_locbox(a):
    """refaire.sh: the crop box of the plant render for the pairs feuille and tige, x0,y0,x1,y1 (stderr and exit 1 when nothing is located)"""
    j = jload(a.json, None)
    try:
        if not isinstance(j, dict):
            raise ValueError('%s: no measures (the render failed?)' % a.json)
        say('%d,%d,%d,%d' % loc_box(j.get('loc'), a.kind))
        return 0
    except ValueError as e:
        sys.stderr.write('locbox %s: %s\n' % (a.kind, e))
        return 1


def cmd_rtsum(a):
    """rtest.sh's last line: what forme writes in its journal"""
    n, same, diff, err = rtest_counts(a.file)
    if not n:
        say('rtest: no result in %s (%s)' % (a.file, (open(a.file, encoding='utf-8', errors='replace').read()[:160] if os.path.exists(a.file) else 'file missing').replace('\n', ' ')))
        return 1
    say('rtest | %s' % ('IDENTIQUE' if not diff and not err else '%d bouquets changés sur %d%s' % (diff, n, ', %d en erreur (ERR)' % err if err else '')))
    return 0 if not err else 1


def cmd_models(a):
    ch = resolve_ch(a.ch)
    a.cap, a.dry = 1000, False
    sid = 'pipe-test'
    ctx = Ctx(sid, ch, a, {'sid': sid, 'taxon': 'Test test', 'steps': {}})
    say('CLI: %s' % ctx.claude)
    for key in [k.strip() for k in a.which.split(',')]:
        r = call_model(ctx, 'models', key, key, 'Answer with exactly this one line and nothing else: {"status":"done","word":"ok"}', ['Read'], turns=2)
        say('  %s: ok=%s final=%s%s' % (MODELS[key], r['ok'], r['final'], ' error: ' + r.get('err', '') if not r['ok'] else ''))
    for line in ctx.bill.table():
        say(line)
    return 0


def cmd_selftest(a):
    """no model, no network: the weights, the parsers, the locks, the checks, and the relay / cap / timeout logic against fake_claude"""
    import tempfile
    global LOCKS, need_servers, RUN_PAIRS
    ok, bad = [], []
    old_ns, old_rp = need_servers, RUN_PAIRS
    old_env = {k: os.environ.get(k) for k in ('FLEUR_PORT', 'PIPE_RAMWAIT', 'FAKE_SEQ')}

    def t(name, cond, info=''):
        (ok if cond else bad).append(name)
        say('  %s %s %s' % ('ok  ' if cond else 'FAIL', name, '' if cond else info))
    tmp = fwd(tempfile.mkdtemp(prefix='pipe-selftest-'))
    old_locks = LOCKS
    try:
        t('eq haiku', abs(Bill.eq('claude-haiku-5-5', {'in': 10, 'cw': 1000, 'cr': 2000, 'out': 100}) - (10 + 1250 + 200 + 500) * .2) < 1e-6)
        t('eq opus', Bill.eq('claude-opus-5-5', {'in': 1000, 'cw': 0, 'cr': 0, 'out': 100}) == 1500)
        t('parse_final last line', parse_final('blah\n{"status":"done","n":3}') == {'status': 'done', 'n': 3})
        t('parse_final inline', parse_final('text {"a":1} more') == {'a': 1})
        t('parse_final none', parse_final('nothing here') is None)
        t('delta_e', delta_e('#808080', '#808080') == 0 and 95 < delta_e('#000000', '#ffffff') < 105)
        t('prompts valid', validate_prompts() == [], str(validate_prompts()))
        t('shot.sh output parsed', last_json('C:/x/fleur/out/a.png\n{"n":162,"el":354,"kb":83,"patch":4.1,"snap":"200x1171x2299"}\n') == {'n': 162, 'el': 354, 'kb': 83, 'patch': 4.1, 'snap': '200x1171x2299'})
        m = AUTO_RE.search('base #d3d1c3 corps #dededa pointe #dbdbd3 confiance 0.82 (centre 0.50,0.48 rayon 0.31)')
        t('refs.py auto output parsed', bool(m) and m[4] == '0.82')
        t('img.py diff output parsed', re.search(r'changed ([\d.]+)%', 'changed 0.00% of pixels (>24), box None')[1] == '0.00')
        LOCKS = tmp + '/locks'
        l1, l2 = Lock(['x-1'], 's1'), Lock(['x-1'], 's2')
        t('lock taken', l1.try_acquire())
        t('lock busy', not l2.try_acquire())
        l1.release()
        t('lock free again', l2.try_acquire())
        l2.release()
        os.makedirs(LOCKS + '/x-1')
        jsave(LOCKS + '/x-1/info.json', {'pid': 4000000, 'sid': 'dead'})
        l3 = Lock(['x-1'], 's3')
        t('lock of a dead pid is stale', l3.try_acquire())
        l3.release()
        fake = tmp + '/fake.cmd'
        open(fake, 'w').write('@python "%s" %%*\r\n' % (HERE + '/pipe/fakeclaude.py').replace('/', '\\'))
        os.environ['FAKE_SEQ'] = tmp + '/seq.json'
        seq = lambda *m: jsave(os.environ['FAKE_SEQ'], list(m))
        ctx = Ctx('selftest', tmp, argparse.Namespace(dry=False, cap=3, claude=fake), {'sid': 'selftest', 'taxon': 'Test test', 'steps': {}, 'skus': []})
        seq('maxturns', 'relay', 'done')
        res, fin = model_loop(ctx, 'finition', 'finition', 'haiku', ['Read'], 4, lambda: (True, ''))
        rows = ctx.bill.rows()
        t('loop: turn cap, relay, then done', res == 'done' and len(rows) == 3, '%s %d' % (res, len(rows)))
        t('etat stub written after the turn cap', os.path.exists(ctx.rc + '/etat-finition.md'))
        t('bill row = usage of the call', rows and (rows[0]['in'], rows[0]['cw'], rows[0]['cr'], rows[0]['out']) == (10, 1000, 2000, 100) and rows[0]['eq'] == 392, str(rows[:1]))
        t('denials counted', rows[1]['denials'] == 1)
        seq('blocked')
        res, fin = model_loop(ctx, 'forme', 'forme', 'haiku', ['Read'], 3, lambda: (True, ''), extra={'kit': '-', 'fiche': '-', 'rtest': '-'})
        t('blocked is reported', res == 'blocked' and fin.get('question') == 'which one?')
        seq('crash')
        r = call_model(ctx, 'x', 'crash', 'haiku', 'hi', ['Read'])
        t('crash is reported, not raised', not r['ok'] and 'boom' in r.get('err', ''), str(r))
        seq('hang')
        t0 = time.time()
        r = call_model(ctx, 'x', 'hang', 'haiku', 'hi', ['Read'], limit=3)
        t('timeout kills the whole tree quickly', r['timeout'] and time.time() - t0 < 12, '%.1f s' % (time.time() - t0))
        ctx2 = Ctx('selftest2', tmp, argparse.Namespace(dry=False, cap=0.0005, claude=fake), {'sid': 'selftest2', 'taxon': 'Test test', 'steps': {}, 'skus': []})
        seq('done', 'done', 'done')
        r1 = call_model(ctx2, 'x', 'a', 'haiku', 'hi', ['Read'])
        r2 = call_model(ctx2, 'x', 'b', 'haiku', 'hi', ['Read'])
        t('cap: flagged on the call that crosses it', not r1['capped'] and r2['capped'])
        try:
            call_model(ctx2, 'x', 'c', 'haiku', 'hi', ['Read'])
            t('cap: next call refused', False)
        except CapReached:
            t('cap: next call refused', True)
        # census and refs checks on a fixture
        rc = ctx.rc
        os.makedirs(rc + '/census', exist_ok=True)
        jsave(rc + '/census/census.json', {'cultivars': [{'nom': 'Alba', 'niveau_provisoire': 'B', 'marque': None, 'photos': [{'img': 'u'}]},
                                                         {'nom': 'Bleu', 'niveau_provisoire': 'C', 'marque': {'indice': 'marque_incertaine'}, 'photos': []}]})
        ctx.st['skus'] = [{'sku': 't~0', 'cultivar': 'Alba'}]
        c = check_census(ctx)
        t('census: bouquet SKU at B passes', c['ok'], c['msg'])
        ctx.st['skus'] = [{'sku': 't~1', 'cultivar': 'Bleu'}]
        c = check_census(ctx)
        t('census: bouquet SKU at C under a brand passes as a question', c['ok'] and 'generic name' in c['msg'], c['msg'])
        jsave(rc + '/keep.json', [{'tags': ['stade:bouton']}, {'tags': ['stade:fané']}, {'tags': ['stade:ouverte']}, {'tags': ['organe:tige']}, {'tags': ['organe:feuille-dessus']}])
        c = check_refs(ctx)
        t('refs: hard minimum (10 photos) fails with 5', not c['ok'] and c['n'] == 5, c['msg'])
        ctx.st['family'] = 'grappe'
        c = targets_cmd(ctx)
        t('targets: the family is passed to fit.py', c[-2:] == ['--family', 'grappe'], str(c[-3:]))
        ctx.st['family'] = ''
        t('targets: no family, no flag', '--family' not in targets_cmd(ctx))
        mm = lambda *k: [{'kind': x} for x in k]
        t('targets: 3 measures of any kind pass', check_targets({'m': mm('leaflw', 'leafang', 'stem')})[0])
        t('targets: 2 measures fail', not check_targets({'m': mm('leaflw', 'leafang')})[0])
        t('targets: a grappe counts its outline', check_targets({'family': 'grappe', 'm': mm('hw', 'taper', 'fill', 'lab')})[0])
        t('targets: a grappe without outline fails', not check_targets({'family': 'grappe', 'm': mm('leaflw', 'leafang', 'stem', 'lab')})[0])
        try:
            import numpy as np
            sys.path.insert(0, HERE)
            import fit as FITMOD
            from PIL import Image, ImageDraw
            r = []
            for ang in (0, 35, 170):  # a cone, upright then tilted: the same ratios (principal axes), whichever end is up
                im = Image.new('L', (200, 260), 0)
                ImageDraw.Draw(im).polygon([(100, 20), (150, 200), (50, 200)], fill=255)
                r.append(FITMOD.thyrse(np.asarray(im.rotate(ang, expand=True, resample=Image.BILINEAR)) > 127))
            t('fit.py thyrse: tilt-proof outline of a cone', all(abs(x['hw'] - r[0]['hw']) < .1 and abs(x['taper'] - r[0]['taper']) < .06 and abs(x['fill'] - r[0]['fill']) < .04 for x in r) and .3 < r[0]['taper'] < .5, str(r))
        except ImportError as e:
            t('fit.py thyrse: tilt-proof outline of a cone', False, str(e))
        rp = rtest_parse('- cylindre-verre-clair IDENTIQUE 5877:1/10 / 5877:1/12 | 2:0.5 coupe-pied-blanche DIFFERENT 5593:1/84 / 5669:2/10 | 3:1 cylindre-verre-clair ERR boom')
        t('rtest line parsed', rp == {'- cylindre-verre-clair': 'IDENTIQUE', '2:0.5 coupe-pied-blanche': 'DIFFERENT', '3:1 cylindre-verre-clair': 'ERR'}, str(rp))
        # ---- pipe v3: the port, the private scripts, the light census, the "vu" field, the comparison pairs, the judge
        os.environ.pop('FLEUR_PORT', None)
        t('port: 8805 by default', port() == 8805)
        t('port: the servers checked are 8805 and 8781, never 8765', [p for p, _ in server_ports()] == [8805, 8781])
        os.environ['FLEUR_PORT'] = '8899'
        t('port: FLEUR_PORT is read at every use', port() == 8899)
        os.environ['FLEUR_PORT'] = '8765'
        try:
            port()
            t('port: 8765 is refused', False)
        except SystemExit:
            t('port: 8765 is refused', True)
        os.environ.pop('FLEUR_PORT', None)
        ctxd = Ctx('selftest-d', tmp, argparse.Namespace(dry=True, cap=40, claude=fake), {'sid': 'selftest-d', 'taxon': 'Test test', 'steps': {}, 'skus': []})
        ctxd.rel_url = 'ch/demo'
        t('port: page URLs on 8805', ctxd.url('pilote/sv.html') == 'http://localhost:8805/ch/demo/pilote/sv.html' and ctxd.url('x', main=True) == 'http://localhost:8805/x')
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            rtest_run(ctxd, ctxd.rel_url, ['a~0:6'], 'rt')
        t('port: the rtest page is asked on 8805', ':8805/ch/demo/pilote/sv.html?rtest=1' in buf.getvalue() and '8765' not in buf.getvalue(), buf.getvalue()[-200:])
        cp = tmp + '/copy'
        os.makedirs(cp + '/fleur')
        os.makedirs(cp + '/app')
        shot_src = '#!/bin/sh\n# shot.sh: server 8765\nsh gate.sh "http://localhost:8765/${REL:+$REL/}pilote/sv.html?$2"\n'
        open(cp + '/fleur/shot.sh', 'w', newline='\n').write(shot_src)
        open(cp + '/fleur/other.sh', 'w', newline='\n').write('#!/bin/sh\necho "http://localhost:8765/x"\nsh fleur/shot.sh a b\n')
        open(cp + '/fleur/quiet.sh', 'w', newline='\n').write('#!/bin/sh\n# the server (8765) in a comment only\necho hi\n')
        ctxp = Ctx('selftest-p', cp, argparse.Namespace(dry=False, cap=40, claude=fake), {'sid': 'selftest-p', 'taxon': 'Test test', 'steps': {}, 'skus': []})
        got = private_scripts(ctxp)
        sp_ = open(cp + '/fleur/shot_p.sh', 'rb').read().decode() if os.path.exists(cp + '/fleur/shot_p.sh') else ''
        t('private: shot_p.sh written on 8805, the shared shot.sh untouched', 'localhost:8805/' in sp_ and '8765' not in sp_ and open(cp + '/fleur/shot.sh').read() == shot_src, sp_)
        t('private: shot_p.sh in LF, its shebang first', '\r\n' not in sp_ and sp_.startswith('#!/bin/sh\n# PRIVATE COPY'))
        op_ = open(cp + '/fleur/other_p.sh').read() if os.path.exists(cp + '/fleur/other_p.sh') else ''
        t('private: another shared script aiming at 8765 gets its copy, which calls shot_p.sh', 'localhost:8805' in op_ and 'fleur/shot_p.sh' in op_, op_)
        t('private: a script naming 8765 in a comment only is left alone', not os.path.exists(cp + '/fleur/quiet_p.sh'))
        t('private: portwrap_p.py copied', os.path.exists(cp + '/fleur/portwrap_p.py') and 'portwrap_p.py' in got)
        open(cp + '/fleur/probe.sh', 'w', newline='\n').write('#!/bin/sh\necho public\n')
        open(cp + '/fleur/probe_p.sh', 'w', newline='\n').write('#!/bin/sh\necho private\n')
        open(cp + '/fleur/caller.py', 'w').write('import os, subprocess\nHERE = os.path.dirname(os.path.abspath(__file__))\n'
                                                 'r = subprocess.run(["sh", os.path.join(HERE, "probe.sh")], capture_output=True, text=True)\nprint("OUT", r.stdout.strip())\n')
        env = dict(os.environ, PATH=os.path.dirname(sh_exe()) + os.pathsep + os.environ.get('PATH', ''))
        pr = subprocess.run([sys.executable, 'fleur/portwrap_p.py', 'fleur/caller.py'], cwd=cp, capture_output=True, text=True, env=env)
        t('portwrap: a shared tool calling shot.sh reaches the private copy', 'OUT private' in pr.stdout, pr.stdout + pr.stderr[-200:])
        # the kit: prefix and sorts already drawn with it
        t('kit: prefix inferred', kit_prefix(['svRose', 'svRoseLeaf', 'svRoseThorns', 'svRoseRun', 'SVROSE_DEF', 'SVROSE_INT']) == 'svRose|SVROSE_',
          kit_prefix(['svRose', 'svRoseLeaf', 'svRoseThorns', 'svRoseRun', 'SVROSE_DEF', 'SVROSE_INT']))
        open(cp + '/app/y3-kit.js', 'w').write('const SVKIT_DEF={};\nfunction svKit(p){}\nfunction svKitLeaf(p){}\nconst svKitT=1;\n')
        open(cp + '/app/y-a.js', 'w').write("const A_SID='sorte-a';\nSV_HEAD[A_SID]=(p)=>svKit(p);\n")
        open(cp + '/app/y-b.js', 'w').write("SV_HEAD['sorte-b']=(p)=>svKitLeaf(p);\n")
        open(cp + '/app/y-c.js', 'w').write("SV_HEAD['sorte-c']=(p)=>other(p);\n")
        ctxp.st['kit'] = 'y3-kit'
        ki = kit_info(ctxp)
        t('kit: the sorts already drawn with the piece are found (const and literal keys)', ki and ki['prefix'] == 'svKit|SVKIT_' and ki['sids'] == ['sorte-a', 'sorte-b'], str(ki))
        t('kit: the forme prompt names the piece, its prefix and its sorts', all(x in kit_text(ctxp) for x in ('y3-kit.js', 'svKit', 'sorte-a', 'IDENTIQUE')))
        t('kit: no move when colourways are only added', sku_moved([['1', 'a~0'], ['2', 'a~1']], [['1', 'a~0'], ['2', 'a~1'], ['3', 'a~2']]) == [])
        t('kit: a SKU moved is caught', sku_moved([['1', 'a~0'], ['2', 'a~1']], [['1', 'a~0'], ['2', 'b~0']]) == ['2: a~1 -> b~0'])
        # census: A, B or C per SKU; D is a question, never a block; the Haiku lots hold only the catalogue's and the trade's colourways
        jsave(rc + '/census/census.json', {'cultivars': [{'nom': 'Alba', 'niveau_provisoire': 'B', 'marque': None, 'photos': [{'img': 'u'}]},
                                                         {'nom': 'Cee', 'niveau_provisoire': 'C', 'marque': None, 'photos': [{'img': 'u'}]},
                                                         {'nom': 'Dee', 'niveau_provisoire': 'D', 'marque': None, 'photos': []}]})
        ctx.st['skus'] = [{'sku': 't~2', 'cultivar': 'Cee'}]
        c = check_census(ctx)
        t('census: a bouquet SKU at C passes', c['ok'], c['msg'])
        ctx.st['skus'] = [{'sku': 't~3', 'cultivar': 'Dee'}, {'sku': 't~4', 'cultivar': 'Nobody'}]
        c = check_census(ctx)
        qmd = open(rc + '/questions.md', encoding='utf-8').read() if os.path.exists(rc + '/questions.md') else ''
        t('census: a SKU at D (or not found) is a question, not a block', c['ok'] and 'SKU t~3' in qmd and 'SKU t~4' in qmd, c['msg'] + ' | ' + qmd[-200:])
        ctx.st['skus'] = [{'sku': 't~0', 'cultivar': 'Alba'}]
        jsave(rc + '/census/douteux-1.json', [{'nom': 'Alba', 'preuves': [{'niveau': 'N4', 'source': 'Wikidata'}]},
                                              {'nom': 'Trade One', 'preuves': [{'niveau': 'N2', 'source': 'Jan de Wit', 'registre': False}]},
                                              {'nom': 'Register Only', 'preuves': [{'niveau': 'N1', 'source': 'KAVB', 'registre': True}], 'photos': []}])
        lot, n_in, n_out = census_lot(ctx, rc + '/census/douteux-1.json')
        names_ = [x['nom'] for x in jload(lot, [])]
        t('census: the Haiku lot keeps the catalogue and trade colourways, not the register-only ones', names_ == ['Alba', 'Trade One'] and n_out == 1, str(names_))
        # refs: a photo stays only if it was looked at and its "vu" field states what its tags say
        t('refs: "vu" parsed', vu_parse('vu: stade=ouvert+declin vue=profil organe=- ; feuille au fond') == {'stade': ['ouvert', 'declin'], 'vue': ['profil'], 'organe': []},
          str(vu_parse('vu: stade=ouvert+declin vue=profil organe=- ; feuille au fond')))
        jsave(rc + '/keep.json', [{'i': 0, 'title': 'a', 'tags': ['stade:ouvert', 'vue:face'], 'm': 'vu: stade=ouvert vue=face ; ok'},
                                  {'i': 1, 'title': 'b', 'tags': ['stade:bouton'], 'm': 'bouton serré (titre)'},
                                  {'i': 2, 'title': 'c', 'tags': ['stade:fane'], 'm': 'vu: stade=ouvert'},
                                  {'i': 25, 'title': 'd', 'tags': ['stade:ouvert'], 'm': 'vu: stade=ouvert'},
                                  {'i': 26, 'title': 'e', 'tags': ['organe:tige'], 'm': 'vu: organe=tige'}])
        ctx.reads['refs'] = {ctx.npath(ctx.rel + '/sheet_0.jpg'), ctx.npath(ctx.rc + '/t026.jpg')}
        n_, bad_ = refs_audit(ctx)
        why_ = {b['title']: b['raison'] for b in bad_}
        t('refs: kept photos seen on their sheet or thumbnail, with their "vu", stay', n_ == 2 and [x['title'] for x in jload(rc + '/keep.json', [])] == ['a', 'e'], str(why_))
        t('refs: a photo without "vu" is set aside', '"vu:"' in why_.get('b', ''), str(why_))
        t('refs: a tag the "vu" field does not state is set aside', 'stade:fane' in why_.get('c', ''), str(why_))
        t('refs: a photo never opened is set aside', 'not looked at' in why_.get('d', ''), str(why_))
        t('refs: what was opened is kept across calls (refs-vus.json)', 't026.jpg' in (jload(rc + '/refs-vus.json', []) or []))
        # comparaison: the pairs, their check; the judge's round trips through cmd_run (the fake model writes and reads like a model)
        need_servers = lambda c: None

        def fake_pairs(c, plan):
            for p in plan:
                f = '%s/%s' % (c.ch, p['png'])
                os.makedirs(os.path.dirname(f), exist_ok=True)
                open(f, 'w').write('png')
        RUN_PAIRS = fake_pairs
        open(tmp + '/ramwait.sh', 'w', newline='\n').write('#!/bin/sh\necho x >> "%s/ramwait.log"\necho "RAM OK"\n' % tmp)
        os.environ['PIPE_RAMWAIT'] = tmp + '/ramwait.sh'
        os.makedirs(tmp + '/fleur', exist_ok=True)
        open(tmp + '/fleur/shot.sh', 'w', newline='\n').write('#!/bin/sh\necho "http://localhost:8765/"\n')
        os.makedirs(tmp + '/app', exist_ok=True)
        KEEP = [{'i': 0, 'title': 'p0', 'page': 'u0', 'tags': ['stade:ouvert', 'vue:face', 'coloris:Alba'], 'm': 'vu: stade=ouvert vue=face'},
                {'i': 1, 'title': 'p1', 'page': 'u1', 'tags': ['stade:ouvert', 'vue:trois-quarts'], 'm': 'vu: stade=ouvert vue=trois-quarts'},
                {'i': 2, 'title': 'p2', 'page': 'u2', 'tags': ['stade:ouvert', 'vue:profil'], 'm': 'vu: stade=ouvert vue=profil'},
                {'i': 3, 'title': 'p3', 'page': 'u3', 'tags': ['stade:bouton', 'vue:profil'], 'm': 'vu: stade=bouton vue=profil'},
                {'i': 4, 'title': 'p4', 'page': 'u4', 'tags': ['stade:declin'], 'm': 'vu: stade=declin'},
                {'i': 5, 'title': 'p5', 'page': 'u5', 'tags': ['stade:fane'], 'm': 'vu: stade=fane'},
                {'i': 6, 'title': 'p6', 'page': 'u6', 'tags': ['organe:plante', 'organe:tige'], 'm': 'vu: organe=plante+tige'},
                {'i': 7, 'title': 'p7', 'page': 'u7', 'tags': ['stade:ouvert', 'vue:face'], 'm': 'vu: stade=ouvert vue=face'},
                {'i': 8, 'title': 'p8', 'page': 'u8', 'tags': ['organe:feuille-dessus'], 'm': 'vu: organe=feuille-dessus'}]
        for x in KEEP:  # P7: every pair photo says its group and has a big copy
            x['m'] += ' groupe=hybride-de-coupe'
        BIG = lambda sid: {str(x['i']): {'w': 1600, 'h': 1200, 'short': 1200, 'file': 'refcache/%s/p%03d.jpg' % (sid, x['i'])} for x in KEEP}
        KEYS = [P['k'] for P in PAIRS] + ['cw-blanc']  # the fixed pairs and one colourway compared to its own variety (9.3c)
        TABLE = '# État\n\n| paire | verdict | écart restant |\n|---|---|---|\n' + ''.join('| %s | ok | |\n' % k for k in KEYS)

        def setup(sid):
            r_ = '%s/refcache/%s' % (tmp, sid)
            os.makedirs(r_, exist_ok=True)
            jsave(r_ + '/keep.json', KEEP)
            jsave(r_ + '/pair-photos.json', BIG(sid))
            jsave(r_ + '/coloris.json', [{'id': 'blanc', 'cultivar': 'Alba'}])
            open(tmp + '/app/y-test.js', 'w').write('// drawing v1\n')
            return 'refcache/%s' % sid

        def comp(rel, n):  # the modeller: retouches app/, redoes the pairs, writes the table, after reading the checklist and every pair
            w = {'app/y-test.js': '// drawing v%d\n' % n}
            w.update({'%s/comparaison/%s.png' % (rel, k): 'png%d' % n for k in KEYS})
            w['%s/etat-comparaison.md' % rel] = TABLE
            return {'mode': 'done', 'write': w, 'read': ['%s/ref/%s' % (rel, BP)] + ['%s/comparaison/%s.png' % (rel, k) for k in KEYS],
                    'final': '{"status":"done","ok":8,"ecarts":0}'}

        def jg(rel, verdict, bp=True, table_first=False):  # the judge: reads the checklist, every pair, then (maybe) the table; notes every line
            ko_ = [] if verdict == 'ok' else [{'paire': 'profil', 'raison': 'flancs trop droits contre la photo'}]
            fin_ = {'verdict': verdict, 'lignes': [{'paire': k, 'note': 'ko' if ko_ and k == 'profil' else 'ok', 'raison': ''} for k in KEYS], 'ko': ko_}
            rd = ['%s/comparaison/%s.png' % (rel, k) for k in KEYS]
            rd = ([rel + '/etat-comparaison.md'] + rd) if table_first else (rd + [rel + '/etat-comparaison.md'])
            return {'mode': 'done', 'read': (['%s/ref/%s' % (rel, BP)] if bp else []) + rd, 'final': json.dumps(fin_, ensure_ascii=False)}

        def run_(args):
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                code_ = cmd_run(make_parser().parse_args(['run'] + args + ['--ch', tmp, '--claude', fake, '--taxon', 'Test test']))
            return code_, buf.getvalue()
        rel3 = setup('selftest3')
        ctx3 = Ctx('selftest3', tmp, argparse.Namespace(dry=False, cap=40, claude=fake), {'sid': 'selftest3', 'taxon': 'Test test', 'steps': {}, 'skus': []})
        plan_, miss_ = pair_plan(ctx3)
        t('comparaison: one kept photo per pair, %d pairs + 1 colourway pair' % len(PAIRS), not miss_ and [p['k'] for p in plan_] == KEYS and plan_[0]['photo'] == 0 and plan_[len(PAIRS) - 1]['photo'] == 7 and plan_[-1]['cw'] == 'blanc',
          str(miss_) + str([(p['k'], p['photo']) for p in plan_]))
        t('comparaison: same angle and stage (profile view 7, faded .6 and .9, plant sheet)', 'view=7' in plan_[2]['query'] and '1:.6' in plan_[4]['query'] and '1:.9' in plan_[5]['query']
          and plan_[6]['query'].startswith('plant=1') and all('seed=7' in p['query'] for p in plan_))
        r7 = tmp + '/refcache/selftest7'
        os.makedirs(r7, exist_ok=True)
        jsave(r7 + '/pair-photos.json', BIG('selftest7'))
        jsave(r7 + '/keep.json', KEEP[:7] + [dict(KEEP[7], tags=['stade:ouvert', 'vue:face', 'coloris:rose-vif'])] + KEEP[8:])
        jsave(r7 + '/coloris.json', [{'id': 'rose', 'cultivar': ''}, {'id': 'rose-vif', 'cultivar': 'Rose Vif'}, {'id': 'x' * 19 + '-y', 'cultivar': ''}])
        ctx7 = Ctx('selftest7', tmp, argparse.Namespace(dry=False, cap=40, claude=fake), {'sid': 'selftest7', 'taxon': 'Test test', 'steps': {}, 'skus': []})
        p7 = pair_plan(ctx7)[0]
        q7 = open(r7 + '/questions.md', encoding='utf-8').read() if os.path.exists(r7 + '/questions.md') else ''
        t('pairs: cw-* by equal colourway names: rose does not take the photo of rose-vif', [p['k'] for p in p7 if p['k'].startswith('cw-')] == ['cw-rose-vif']
          and p7[-1]['photo'] == 7, str([(p['k'], p['photo']) for p in p7]))
        t('pairs: a colourway without its own photo is a question, not a silent skip', 'coloris rose (nom générique)' in q7 and 'coloris ' + 'x' * 19 + '-y' in q7, q7[-400:])
        jsave(r7 + '/keep.json', KEEP[:7] + [dict(KEEP[7], tags=['stade:ouvert', 'vue:face', 'coloris:' + 'x' * 19 + '-y'])] + KEEP[8:])
        t('pairs: a cw- key cut at 20 characters keeps no trailing dash (the table key matches)', [p['k'] for p in pair_plan(ctx7)[0] if p['k'].startswith('cw-')] == ['cw-' + 'x' * 19])
        q_ = {p['k']: p for p in plan_}
        t('pairs: a tulip keeps view 7 for the profile and the bud (no family)', view_family(ctx3) == '' and q_['profil']['view'] == 7 and q_['bouton']['view'] == 7)
        ctx3.st.update(taxon='Cymbidium hybrida', kit='y3-orchidee.js')
        plo_ = {p['k']: p for p in pair_plan(ctx3)[0]}
        t('pairs: an orchid (kit y3-orchidee.js) gets view 8 for the profile and the bud, written in the plan', view_family(ctx3) == 'orchidee' and 'view=8' in plo_['profil']['query']
          and 'view=8' in plo_['bouton']['query'] and plo_['profil']['view'] == 8 and plo_['profil']['view_from'] == 'famille orchidee' and 'view=0' in plo_['face']['query'],
          str([(p['k'], p.get('view'), p.get('view_from')) for p in plo_.values()]))
        ctx3.st.update(taxon='Phalaenopsis hybrida', kit='')
        t('pairs: an orchid found by its genus alone', view_family(ctx3) == 'orchidee' and pair_views(ctx3)[0]['profil'] == 8)
        ctx3.st.update(taxon='Anthurium andraeanum', views={'profil': 4})
        t('pairs: a sort with --views beats the family table (spathe)', pair_views(ctx3)[0]['profil'] == 4 and pair_views(ctx3)[0]['bouton'] == 8
          and parse_views('profil:8, bouton:8,x') == {'profil': 8, 'bouton': 8})
        ctx3.st.update(taxon='Test test')
        ctx3.st.pop('views')
        ctx3.st.pop('kit')
        write_pairs(ctx3, plan_)
        rs_ = open('%s/comparaison/refaire.sh' % ctx3.rc).read()
        t('comparaison: refaire.sh renders through shot_p.sh and pairs with img.py, never 8765', 'fleur/shot_p.sh' in rs_ and 'img.py pair' in rs_ and '8765' not in rs_ and 'D=800' in rs_)
        t('comparaison: refaire.sh asks big pairs (img.py pair --h 1100 --w 2400)', rs_.count('--h 1100 --w 2400') == len(plan_), str(rs_.count('--h 1100 --w 2400')))
        t('comparaison: refaire.sh gives img.py pair the brief of the sort (its own ranges)', rs_.count('--brief %s/brief.md' % rel3) == len(plan_))
        fake_pairs(ctx3, plan_)
        okc, whyc = check_comparaison(ctx3, plan_, reads=False)
        t('comparaison: the check wants the full table', not okc and 'no line in the table' in whyc, whyc)
        open(ctx3.rc + '/etat-comparaison.md', 'w').write(TABLE.replace('| bouton | ok | |', '| bouton | | |'))
        okc, whyc = check_comparaison(ctx3, plan_, reads=False)
        t('comparaison: a line without verdict nor gap fails', not okc and 'bouton' in whyc, whyc)
        open(ctx3.rc + '/etat-comparaison.md', 'w').write(TABLE)
        os.remove('%s/%s' % (tmp, plan_[3]['png']))
        okc, whyc = check_comparaison(ctx3, plan_, reads=False)
        t('comparaison: a missing pair fails', not okc and 'bouton: pair missing' in whyc, whyc)
        fake_pairs(ctx3, plan_)
        time.sleep(.05)
        open(tmp + '/app/y-test.js', 'w').write('// drawing v1b\n')
        okc, whyc = check_comparaison(ctx3, plan_, reads=False)
        t('comparaison: pairs older than the last retouch of app/ fail', not okc and 'older than the last change' in whyc, whyc)
        seq(comp(rel3, 2))
        code_, out_ = run_(['selftest3', '--only', 'comparaison'])
        st3 = jload(ctx3.rc + '/pipe-state.json', {})
        t('comparaison: the step ends when the pairs are fresh, looked at and the table full', code_ == 0 and st3['steps']['comparaison']['status'] == 'done', out_[-400:])
        n_rw = len(open(tmp + '/ramwait.log').read().split()) if os.path.exists(tmp + '/ramwait.log') else 0
        t('ramwait.sh before the Opus call', n_rw >= 1, str(n_rw))
        seq(jg(rel3, 'ko'), comp(rel3, 3), jg(rel3, 'ok'))
        code_, out_ = run_(['selftest3', '--only', 'juge'])
        st3 = jload(ctx3.rc + '/pipe-state.json', {})
        jr = [r for r in Bill(ctx3.rc + '/pipe-bill.json').rows() if r['step'] == 'juge']
        t('juge: ko -> comparaison -> ok ends the step (1 round trip)', code_ == 0 and st3['steps']['juge']['status'] == 'done' and st3['steps']['juge'].get('trips') == 1
          and len(jr) == 2 and os.path.exists(ctx3.rc + '/comparaison/ko-1.json'), out_[-500:])
        fp3 = st3['steps']['juge'].get('fp')
        t('juge: the ok keeps the fingerprint of app/*.js and pilote/svtest.js', fp3 and fp3 == code_fp(ctx3) and judged_code(Ctx('selftest3', tmp, argparse.Namespace(dry=False, cap=40, claude=fake), st3))[0],
          str(fp3))
        t('juge: the judge is a fresh Opus xhigh call, read-only (Read, Glob, Grep, Bash for img.py only)', all(r['model'] == 'opus' and r.get('tools') == 'Bash,Glob,Grep,Read'
          and r.get('effort') == 'xhigh' for r in jr), str([(r.get('tools'), r.get('effort')) for r in jr]))
        P_ = {n: open('%s/pipe/prompts/%s.md' % (HERE, n), encoding='utf-8').read() for n in ('forme', 'plante', 'finition', 'fit', 'comparaison', 'juge')}
        t('prompts: forme, plante, comparaison and juge make BONNES-PRATIQUES compulsory', all('BONNES-PRATIQUES.md' in P_[n] and 'EN ENTIER' in P_[n] for n in ('forme', 'plante', 'comparaison', 'juge')))
        t('prompts: renders through shot_p.sh with seed=7, never fleur/shot.sh', all('fleur/shot.sh' not in v for v in P_.values()) and all('shot_p.sh' in P_[n] and 'seed=7' in P_[n] for n in ('forme', 'plante', 'finition')))
        t('prompts: the known traps are listed (transparency, paper cut-out, profile, faded stem, coarse strokes)', all(x in P_['forme'] for x in ('transparents', 'papier découpé', 'profil', 'traverse', '3.6b')))
        rel4 = setup('selftest4')
        seq(comp(rel4, 2))
        run_(['selftest4', '--only', 'comparaison'])
        seq(jg(rel4, 'ko'), comp(rel4, 3), jg(rel4, 'ko'))
        code_, out_ = run_(['selftest4', '--only', 'juge', '--juge-tours', '1'])
        st4 = jload(tmp + '/refcache/selftest4/pipe-state.json', {})
        t('juge: refused after 2 ko (--juge-tours 1): exit 2, report written, not finished', code_ == 2 and st4['steps']['juge'].get('refused') and 'REFUSED' in out_
          and os.path.exists(tmp + '/refcache/selftest4/comparaison/refus.md') and 'FINI' not in out_, out_[-500:])
        nb = len(Bill(tmp + '/refcache/selftest4/pipe-bill.json').rows())
        code_, out_ = run_(['selftest4', '--only', 'juge'])
        t('juge: a refused sort stays refused without --from (no new call)', code_ == 2 and len(Bill(tmp + '/refcache/selftest4/pipe-bill.json').rows()) == nb, out_[-300:])
        rel5 = setup('selftest5')
        seq(comp(rel5, 2))
        run_(['selftest5', '--only', 'comparaison'])
        seq(jg(rel5, 'ko'), comp(rel5, 3), jg(rel5, 'ko'), comp(rel5, 4), jg(rel5, 'ko'))
        code_, out_ = run_(['selftest5', '--only', 'juge'])
        st5 = jload(tmp + '/refcache/selftest5/pipe-state.json', {})
        n5 = len([r for r in Bill(tmp + '/refcache/selftest5/pipe-bill.json').rows() if r['step'] == 'juge'])
        t('juge: refused after 2 round trips (default --juge-tours 2): 3 verdicts, exit 2', code_ == 2 and st5['steps']['juge'].get('refused') and st5['steps']['juge'].get('trips') == 2 and n5 == 3,
          '%s %s %s' % (code_, n5, out_[-300:]))
        seq({'mode': 'done', 'read': [], 'final': '{"verdict":"ok","lignes":[],"ko":[]}'}, {'mode': 'done', 'read': [], 'final': 'no json'})
        v_ = judge(ctx3, plan_, 0)
        t('juge: a judge that looked at nothing is asked again, then counts as ko', v_['verdict'] == 'ko' and any('not looked at' in x for x in v_['issues']), str(v_)[:300])
        seq(jg(rel3, 'ok', bp=False), jg(rel3, 'ok', bp=False))
        v_ = judge(ctx3, plan_, 0)
        t('juge: a judge that never opened BONNES-PRATIQUES is asked again, then counts as ko', v_['verdict'] == 'ko' and any('BONNES-PRATIQUES' in x for x in v_['issues']), str(v_)[:300])
        seq(jg(rel3, 'ok', table_first=True), jg(rel3, 'ok', table_first=True))
        v_ = judge(ctx3, plan_, 0)
        t('juge: reading the modeller table before the pairs counts as ko (anchoring)', v_['verdict'] == 'ko' and any('anchoring' in x for x in v_['issues']), str(v_)[:300])
        seq(jg(rel3, 'ok'))
        v_ = judge(ctx3, plan_, 0)
        t('juge: checklist, every pair, then the table: ok', v_['verdict'] == 'ok' and not v_['issues'], str(v_)[:300])
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            judge_once(ctxd, plan_, 0, 1)
        P_j = open('%s/pipe/prompts/juge.md' % HERE, encoding='utf-8').read()
        t('juge: 60 turns, and the prompt gives the modeller table after the judge verdicts', '60 turns max' in buf.getvalue() and P_j.index('APRÈS') < P_j.index('<<table>>')
          and '60 tours' in P_j, buf.getvalue()[-200:])
        open(tmp + '/app/y-test.js', 'a').write('// retouched after the judge\n')
        ctx3b = Ctx('selftest3', tmp, argparse.Namespace(dry=False, cap=40, claude=fake), st3)
        try:
            step_planches(ctx3b)
            t('planches: refused when app/ changed after the judge said ok (no FINI either)', False)
        except StepFailed as e:
            ctx3b.st = dict(st3, steps={n: {'status': 'done', **({'fp': fp3} if n == 'juge' else {})} for n in STEPS})
            f_ = fini(ctx3b)
            t('planches: refused when app/ changed after the judge said ok (no FINI either)', 'changed since the judge' in str(e) and f_ and not f_[0] and 'NOT FINISHED' in f_[1],
              str(e) + str(f_))
        ctx4 = Ctx('selftest4', tmp, argparse.Namespace(dry=False, cap=40, claude=fake), st4)
        try:
            step_planches(ctx4)
            t('planches: no catalogue sheet for a sort the judge refused', False)
        except StepFailed:
            t('planches: no catalogue sheet for a sort the judge refused', True)
        t('table_rows: the key is the first cell, the header and the rule are skipped', set(table_rows(ctx3.rc + '/etat-comparaison.md')) == set(KEYS) | {'paire'})
        # ---- outils-v4b, P15: the morphological fiche in the chain
        t('fiche: a step between targets and forme', STEPS.index('targets') < STEPS.index('fiche') == STEPS.index('forme') - 1)
        root = fwd(os.path.dirname(HERE))
        fx = tmp + '/fx'
        os.makedirs(fx)
        K1 = 'fx-a:' + sha8('http://x/1.jpg')
        V = lambda v, **k: dict({'v': v, 'methode': 'segmente', 'photos': [K1], 'conf': 'C', 'n': 1}, **k)

        def mini(sid, organes):
            return {'schema': 'fiche-morpho/1', 'sid': sid, 'nom': 'Essai', 'taxon': {'genre': 'Test'}, 'kit': {'moteur': 'svBloom', 'module': 'app/y2.js'},
                    'photos': {K1.replace('fx-a', sid): {'titre': 'File:1', 'auteur': 'a', 'licence': 'CC BY', 'url': 'http://x/p1', 'url_image': 'http://x/1.jpg',
                                                         'local': 'refcache/%s/t001.jpg' % sid, 'tags': ['stade:ouvert'], 'vu': 'ouvert', 'echelle': None}},
                    'organes': organes, 'varietes': {}, 'stades': {'table': [{'stade': s, 'op': 0, 'wl': 0, 'photos': [], 'statut': 'hypothese'}
                                                                             for s in ('bouton', 'gonfle', 'entrouvert', 'ouvert', 'plein', 'declin', 'fane')]},
                    'rendu': {}, 'questions': []}

        def fcheck(o, *extra):
            p_ = '%s/fx-a.json' % fx
            with open(p_, 'w', encoding='utf-8', newline='\n') as fo:
                fo.write(json.dumps(mini('fx-a', o), ensure_ascii=False, indent=1))
            r_ = subprocess.run([sys.executable, 'fleur/fiche.py', 'check', p_, '--quiet'] + list(extra), cwd=root, capture_output=True, timeout=300)
            return r_.returncode, r_.stdout.decode('utf-8', 'replace')
        good = {'petale': {'role': 'perianthe', 'courbure': {'pied_deg': V(30, unite='deg', repere='axe')},
                           'taille': {'rayon': V(.125, unite='R0', code='const', ligne='app/y2.js:86', retenu=.125)}}}
        c_, o_ = fcheck(good)
        t('fiche.py: a fiche with an angle frame and a hard-coded constant read at its line is valid', c_ == 0 and '"valide": true' in o_, o_[-600:])
        bad_ = json.loads(json.dumps(good))
        del bad_['petale']['courbure']['pied_deg']['repere']
        c_, o_ = fcheck(bad_)
        t('fiche.py: an angle without `repere` is refused', c_ == 1 and 'repere' in o_, o_[-300:])
        bad_ = json.loads(json.dumps(good))
        bad_['petale']['taille']['rayon']['ecart'] = 'texte libre'
        c_, o_ = fcheck(bad_)
        t('fiche.py: a free-text ecart is refused (typed: confirme, divergence, budget)', c_ == 1 and 'ecart non type' in o_, o_[-300:])
        bad_ = json.loads(json.dumps(good))
        bad_['petale']['taille']['rayon']['ligne'] = 'app/y2.js:1'
        c_, o_ = fcheck(bad_)
        t('fiche.py: a "const" whose number is not on its line is refused (the code moved)', c_ == 1 and 'absente de app/y2.js:1' in o_, o_[-300:])
        c_, o_ = fcheck(good, '--lien', 'tete')
        t('fiche.py --lien tete: a head value without code nor ecart is refused', c_ == 1 and 'petale/courbure/pied_deg' in o_ and '"non_relies": 1' in o_, o_[-300:])
        good['petale']['courbure']['pied_deg']['ecart'] = {'type': 'divergence', 'texte': 'pas encore relié au dessin'}
        c_, o_ = fcheck(good, '--lien', 'tete')
        t('fiche.py --lien tete: with a typed ecart it passes', c_ == 0, o_[-300:])
        r_ = subprocess.run([sys.executable, 'fleur/fiche.py', 'check', 'anemone-coronaria', '--quiet'], cwd=root, capture_output=True, timeout=300)
        t('fiche.py: the anemone pilot stays valid', r_.returncode == 0, r_.stdout.decode('utf-8', 'replace')[-300:])
        # the step: registry from keep.json, then the numbers pipe.py adds to fiche.py
        os.makedirs(tmp + '/fleur', exist_ok=True)
        for f_ in ('fiche.py', 'fiche_eval.js'):
            shutil.copyfile('%s/%s' % (HERE, f_), '%s/fleur/%s' % (tmp, f_))
        open(tmp + '/mkapp.sh', 'w', newline='\n').write('#!/bin/sh\ncat a1.html y-test.js > ../demo7.html\n')
        ctxF = Ctx('fx-b', tmp, argparse.Namespace(dry=False, cap=40, claude=fake), {'sid': 'fx-b', 'taxon': 'Test test', 'steps': {}, 'skus': []})
        jsave(ctxF.rc + '/cands.json', [{'title': 'File:%d' % i, 'thumb': 'http://x/%d.jpg' % i, 'page': 'http://x/p%d' % i, 'author': 'a', 'lic': 'CC BY'} for i in range(3)])
        jsave(ctxF.rc + '/keep.json', [{'i': 0, 'title': 'File:0', 'page': 'http://x/p0', 'author': 'a', 'lic': 'CC BY', 'tags': ['stade:ouvert'], 'm': 'vu: stade=ouvert vue=face'},
                                       {'i': 2, 'title': 'File:2', 'page': 'http://x/p2', 'author': 'a', 'lic': 'CC BY', 'tags': ['organe:tige'], 'm': 'vu: organe=tige'}])
        s1_ = fiche_skeleton(ctxF)
        fb = jload(tmp + '/' + fiche_rel(ctxF), {})
        k0_, k2_ = 'fx-b:' + sha8('http://x/0.jpg'), 'fx-b:' + sha8('http://x/2.jpg')
        t('fiche: the skeleton holds the kept photos only, keyed by the sha1 of their image URL', s1_ == 'new' and sorted(fb.get('photos', {})) == sorted([k0_, k2_])
          and fb['photos'][k2_]['local'] == 'refcache/fx-b/t002.jpg' and fb['photos'][k0_]['vu'] == 'stade=ouvert vue=face', str(fb.get('photos'))[:300])
        org = {'petale': {'role': 'perianthe', 'taille': {'a': V(.5, photos=[k0_]), 'b': V(.6, photos=[k0_]), 'c': V(.7, photos=[k0_])}},
               'bouton': {'role': 'bouton', 'taille': {'hw': V(1.4, photos=[k0_]), 'l': V(.3, photos=[k0_])}},
               'tige': {'role': 'tige', 'section': {'d': V(.05, unite='D', photos=[k2_])}, 'taille': {'l': V(40, unite='cm', photos=[k2_])}},
               'feuille': {'role': 'feuille', 'contour': {'L_sur_l': V(6, photos=[k2_])}}}
        fb['organes'] = {'petale': org['petale']}
        jsave(tmp + '/' + fiche_rel(ctxF), fb)
        okf, whyf = check_fiche(ctxF)
        t('fiche: too few measures, roles missing and no measuring command fail the step', not okf and 'values measured' in whyf and 'bouton, tige, feuille' in whyf and 'measuring commands' in whyf, whyf)
        fb['organes'], fb['stades'] = org, mini('fx-b', {})['stades']
        jsave(tmp + '/' + fiche_rel(ctxF), fb)
        ctxF.cmds['fiche'] = ['python -P fleur/organ.py leaf refcache/fx-b/t002.jpg "0,0,9,9" && python -P fleur/organ.py stem refcache/fx-b/t002.jpg "0,0,9,9" | head',
                              'python fleur/img.py pair refcache/fx-b/t000.jpg "0,0,9,9" fleur/out/a.png "0,0@600"']
        okf, whyf = check_fiche(ctxF)
        t('fiche: 8 values measured with 3 measuring commands, the four roles: the step can end', okf, whyf)
        fb['photos']['fx-b:' + sha8('http://y/9.jpg')] = dict(fb['photos'][k0_], url_image='http://y/9.jpg')
        jsave(tmp + '/' + fiche_rel(ctxF), fb)
        okf, whyf = check_fiche(ctxF)
        t('fiche: a photo that was not kept in the registry fails', not okf and 'not kept' in whyf, whyf)
        P_f = open('%s/pipe/prompts/fiche.md' % HERE, encoding='utf-8').read()
        t('prompts: fiche reads SCHEMA in full and runs fiche.py check; forme and plante tie the fiche to the code (--lien)', '<<schema>>' in P_f and 'EN ENTIER' in P_f
          and 'fiche.py check' in P_f and '--lien tete' in open('%s/pipe/prompts/forme.md' % HERE, encoding='utf-8').read()
          and '--lien tout' in open('%s/pipe/prompts/plante.md' % HERE, encoding='utf-8').read())
        # ---- P8: forme is done only with its face pair measured and the sort's rtest, written in the journal
        ctxP = Ctx('fx-p', tmp, argparse.Namespace(dry=False, cap=40, claude=fake), {'sid': 'fx-p', 'taxon': 'Test test', 'steps': {},
                                                                                     'skus': [{'sku': 'fx-p~0', 'cultivar': 'A', 'tiges': 5}]})
        os.makedirs(ctxP.rc + '/comparaison', exist_ok=True)
        os.makedirs(ctxP.rc + '/temoins', exist_ok=True)
        write_forme_tools(ctxP)
        rts = open(ctxP.rc + '/rtest.sh', encoding='utf-8').read() if os.path.exists(ctxP.rc + '/rtest.sh') else ''
        t('forme: rtest.sh asks the rtest of the sort (its SKUs) on 8805 through the gate, never 8765', 'rc=fx-p~0:5' in rts and ':8805/' in rts and 'ws/gate.sh' in rts
          and '8765' not in rts and 'rtsum' in rts and os.path.exists(ctxP.rc + '/comparaison/refaire.sh'), rts[-300:])
        t('forme: rtest policy strict for a sort without an old drawing', rtest_policy(ctxP)[0] == 'strict')
        open(ctxP.rc + '/temoins/sku-avant.csv', 'w', newline='\n').write('sku;id;sid;cn;col;fam;ret\n1;fx-p~0;fx-p;a;b;c;0\n2;z~0;z;a;b;c;0\n')
        t('forme: rtest policy report for a sort that replaces an old drawing (owner, 2026-10-18)', rtest_policy(ctxP)[0] == 'report')
        okP, whyP = check_forme_proofs(ctxP)
        t('forme: no face pair and no rtest: not done', not okP and 'no face pair' in whyP and 'no rtest' in whyP, whyP)
        time.sleep(.05)
        open(ctxP.rc + '/comparaison/face.png', 'w').write('png')
        open(ctxP.rc + '/comparaison/face.txt', 'w').write('x.png (10, 10)\nphoto: H/W 1.02  W/H 0.98  angle 4 deg  (98x100 px)\nrendu: H/W 0.95  W/H 1.05  angle 6 deg  (105x100 px)\nbrief: pas de fourchette\n')
        RT = '- cylindre-verre-clair IDENTIQUE 1:1/1 / 1:1/1 | 0:0.5 cylindre-verre-clair DIFFERENT 2:3/4 / 2:5/4 | 2:0.5 coupe-pied-blanche DIFFERENT 2:3/4 / 2:5/4 | 3:1 coupe-pied-blanche IDENTIQUE 1:1/1 / 1:1/1'
        open(ctxP.rc + '/temoins/rtest-forme.txt', 'w').write(RT)
        open(ctxP.rc + '/journal.md', 'w', encoding='utf-8').write('tour 1 | paire face | photo W/H 0.98 | rendu W/H 1.05 | trop large\ntour 2 | rtest | 1 bouquets changés sur 4\n')
        okP, whyP = check_forme_proofs(ctxP)
        t('forme: a journal rtest count that is not the rtest fails', not okP and 'says 1 changed, the rtest 2' in whyP, whyP)
        open(ctxP.rc + '/journal.md', 'a', encoding='utf-8').write('tour 3 | rtest | 2 bouquets changés sur 4 | ancien dessin\n')
        okP, whyP = check_forme_proofs(ctxP)
        t('forme: face pair measured and rtest changed but reported (a new drawing replacing an old one): done', okP, whyP)
        os.remove(ctxP.rc + '/temoins/sku-avant.csv')
        okP, whyP = check_forme_proofs(ctxP)
        t('forme: a changed rtest blocks a sort without an old drawing', not okP and 'must stay IDENTIQUE' in whyP, whyP)
        ctxP.st['rtest_bouge'] = 'tête en vraie taille, comme l\'anthurium'
        okP, whyP = check_forme_proofs(ctxP)
        t('forme: --rtest-bouge (owner\'s exception) reports instead of blocking', okP and rtest_policy(ctxP)[0] == 'report', whyP)
        open(ctxP.rc + '/journal.md', 'a', encoding='utf-8').write('tour 4 | paire face | photo W/H 0.98 | rendu W/H 1.00\n')
        okP, whyP = check_forme_proofs(ctxP)
        t('forme: the last face line of the journal must be face.txt', not okP and 'is not face.txt' in whyP, whyP)
        time.sleep(.05)
        open(tmp + '/app/y-test.js', 'a').write('// retouched after the proofs\n')
        okP, whyP = check_forme_proofs(ctxP)
        t('forme: proofs older than the last retouch of app/ fail', not okP and 'face pair older' in whyP and 'rtest older' in whyP, whyP)
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            cr_ = cmd_rtsum(argparse.Namespace(file=ctxP.rc + '/temoins/rtest-forme.txt'))
        t('rtsum: the journal line of an rtest', cr_ == 0 and buf.getvalue().strip() == 'rtest | 2 bouquets changés sur 4', buf.getvalue())
        # ---- P5: leaf and stem pairs from one located plant render; nothing floats at plante (jgap.py)
        pp_ = {p['k']: p for p in plan_}
        t('pairs: feuille (top side) and tige (junction) from the kept organ photos, one shared plant render with loc=1',
          pp_['feuille']['photo'] == 8 and pp_['tige']['photo'] == 6 and pp_['feuille']['render'] == pp_['plante']['render'] == pp_['tige']['render']
          and 'loc=1' in pp_['plante']['query'] and 'cell=%d' % PLANT_CELL in pp_['tige']['query'] and pp_['feuille']['cell'] == 'loc:feuille', str({k: (p['photo'], p['cell']) for k, p in pp_.items()}))
        t('pairs: a whole plant is compared to a whole plant only (no fallback on a stem close-up)', [P['want'] for P in PAIRS if P['k'] == 'plante'] == [[['organe:plante']]])
        t('pairs: refaire.sh crops the plant render with locbox and reuses a fresh render of the same query', 'pipe.py locbox fleur/out/cmp_selftest3_plante.json feuille' in rs_
          and 'fresh() {' in rs_ and rs_.count('if ! fresh ') == len(plan_), rs_[-400:])
        LOCX = {'size': [1800, 3960], 'cells': [{'stem': [[900, 3800 - 140 * i] for i in range(25)], 'w': 14, 'sbox': [880, 440, 920, 3800],
                                                 'leaves': [[700, 2000, 880, 2300], [920, 1500, 1300, 1700]]}]}
        t('locbox: the leaf crop is the biggest leaf, padded', loc_box(LOCX, 'feuille') == (897, 1488, 1322, 1712), str(loc_box(LOCX, 'feuille')))
        bt_ = loc_box(LOCX, 'tige')
        t('locbox: the stem crop is centred on the stem where that leaf joins it', bt_[0] < 900 < bt_[2] and bt_[1] < 1560 < bt_[3] and abs((bt_[2] - bt_[0]) - .14 * 3360) < 2, str(bt_))
        try:
            loc_box({'cells': [{'stem': [[1, 1]], 'leaves': []}]}, 'feuille')
            t('locbox: no leaf located is said, not guessed', False)
        except ValueError as e:
            t('locbox: no leaf located is said, not guessed', 'no leaf located' in str(e))
        sv_ = open(root + '/pilote/svtest.js', encoding='utf-8').read()
        t('svtest: loc=1 is opt-in (read-only: children counted, boxes measured after the drawing)', "get('loc')" in sv_ and 'if(LOC){' in sv_ and 'o.loc=' in sv_)
        try:
            import numpy as np
            from PIL import Image, ImageDraw
            for nb, name_ in ((0, 'jg0'), (1, 'jg1')):
                im = Image.new('RGB', (400, 300), (233, 228, 220))
                d_ = ImageDraw.Draw(im)
                for c in range(2):
                    d_.rectangle([c * 200 + 95, 40, c * 200 + 105, 280], fill=(60, 110, 50))
                    d_.ellipse([c * 200 + 70, 20, c * 200 + 130, 70], fill=(200, 40, 60))
                if nb:
                    d_.ellipse([140, 150, 160, 170], fill=(60, 110, 50))  # a leaf apart from the stem in cell 0
                im.save('%s/%s.png' % (tmp, name_))
            o0 = subprocess.run([sys.executable, HERE + '/jgap.py', tmp + '/jg0.png', '2', '40'], capture_output=True, text=True).stdout
            o1 = subprocess.run([sys.executable, HERE + '/jgap.py', tmp + '/jg1.png', '2', '40'], capture_output=True, text=True).stdout
            t('jgap: a plant sheet without a detached piece passes, one with a piece apart fails', jgap_verdict(o0)[0] and not jgap_verdict(o1)[0] and 'cell 0: 1 piece' in jgap_verdict(o1)[1],
              o0 + o1)
        except ImportError as e:
            t('jgap: a plant sheet without a detached piece passes, one with a piece apart fails', False, str(e))
        t('prompts: plante redoes the leaf and stem pairs and knows the jgap check', all(x in open('%s/pipe/prompts/plante.md' % HERE, encoding='utf-8').read() for x in ('refaire.sh feuille tige', 'jgap')))
        # ---- P6: the colour of each colourway against its measure, in finition (cwmed.py on a sheet: a fake shot_p.sh copies a made-up sheet)
        try:
            from PIL import Image, ImageDraw
            G_ = [('rouge', '#c83c50'), ('bleu', '#3a4fc0'), ('blanc', '#fbfaf6')]
            im = Image.new('RGB', (290, 230 * len(G_) + 40), (233, 228, 220))
            d_ = ImageDraw.Draw(im)
            for r, (cid, hx) in enumerate(G_):
                d_.ellipse([75, 20 + 230 * r + 46, 235, 20 + 230 * r + 206], fill=hex_rgb(hx))
            im.save(tmp + '/cw_sheet.png')
            shutil.copyfile(HERE + '/cwmed.py', tmp + '/fleur/cwmed.py')
            open(tmp + '/fleur/shot_p.sh', 'w', newline='\n').write('#!/bin/sh\nmkdir -p fleur/out\ncp "%s" "fleur/out/$1.png"\necho "fleur/out/$1.png"\necho \'{"n":3,"el":120,"kb":12}\'\n' % (tmp + '/cw_sheet.png'))
            ctxC = Ctx('fx-c', tmp, argparse.Namespace(dry=False, cap=40, claude=fake), {'sid': 'fx-c', 'taxon': 'Test test', 'steps': {}, 'skus': []})
            jsave(ctxC.rc + '/coloris.json', [{'id': 'rouge', 'corps': '#c83c50'}, {'id': 'bleu', 'corps': '#3a4fc0'}, {'id': 'blanc', 'corps': '#f7f4ec'}])
            okc, msgc, rowsc = colour_check(ctxC)
            t('finition: colourways rendered at their measure pass (a white by lightness and chroma, not hue)', okc and len(rowsc) == 3
              and [r['rule'] for r in rowsc] == ['L+h', 'L+h', 'L+C'], msgc + str(rowsc))
            jsave(ctxC.rc + '/coloris.json', [{'id': 'rouge', 'corps': '#c83c50'}, {'id': 'bleu', 'corps': '#8a3fc0'}, {'id': 'blanc', 'corps': '#d8d2c0'}])
            okc, msgc, rowsc = colour_check(ctxC)
            t('finition: a colourway off its hue and a white too dark are refused, by name, and written in couleur.md', not okc and 'bleu (dL' in msgc and 'blanc (dL' in msgc
              and 'rouge' not in msgc.split(':', 1)[-1] and 'À REPRENDRE' in open(ctxC.rc + '/couleur.md', encoding='utf-8').read(), msgc)
        except ImportError as e:
            t('finition: colourways rendered at their measure pass (a white by lightness and chroma, not hue)', False, str(e))
        # ---- P7: photo groups, pair copies of 1 000 px, colour audit of the coloris: photos
        t('refs: "vu" states the group (aliases)', vu_parse('vu: stade=ouvert groupe=hybride ; x').get('groupe') == ['hybride-de-coupe']
          and photo_groupe({'m': 'vu: vue=face groupe=espece-sauvage'}) == 'espece-sauvage' and photo_groupe({'m': 'vu: vue=face'}) is None)
        ctxE = Ctx('fx-e', tmp, argparse.Namespace(dry=False, cap=40, claude=fake), {'sid': 'fx-e', 'taxon': 'Test test', 'steps': {}, 'skus': []})
        ke = [{'i': 0, 'tags': ['stade:ouvert', 'vue:face'], 'm': 'vu: stade=ouvert vue=face groupe=espece-sauvage'},
              {'i': 1, 'tags': ['stade:ouvert', 'vue:face'], 'm': 'vu: stade=ouvert vue=face groupe=hybride-de-coupe'},
              {'i': 2, 'tags': ['stade:ouvert', 'vue:face'], 'm': 'vu: stade=ouvert vue=face groupe=jardin'},
              {'i': 3, 'tags': ['stade:ouvert', 'vue:face'], 'm': 'vu: stade=ouvert vue=face'}]
        jsave(ctxE.rc + '/keep.json', ke)
        infoE = {'0': {'short': 1200, 'file': 'a'}, '1': {'short': 640, 'file': 'b', 'err': ''}, '2': {'short': 1100, 'file': 'refcache/fx-e/p002.jpg'}, '3': {'short': 1500, 'file': 'd'}}
        el_ = [pair_eligible(ctxE, x, infoE) for x in ke]
        t('pairs: only a cut hybrid or a garden form with a copy of 1 000 px or more (wild, small, no group: out)', [e[0] for e in el_] == [False, False, True, False]
          and 'groupe espece-sauvage' in el_[0][1] and 'short side 640' in el_[1][1] and 'no groupe=' in el_[3][1], str(el_))
        pe_ = pair_plan(ctxE, infoE)[0]
        t('pairs: the eligible photo is used, from its big copy p<NNN>.jpg', [p['photo'] for p in pe_ if p['k'] == 'face'] == [2] and pe_[0]['thumb'] == 'refcache/fx-e/p002.jpg', str(pe_[:1]))
        ctxE.st['groupes'] = 'espece-sauvage'
        t('pairs: --groupes espece-sauvage for a wild sort', pair_eligible(ctxE, ke[0], infoE)[0] and not pair_eligible(ctxE, ke[2], infoE)[0])
        ctxE.st.pop('groupes')
        miss_e = pair_plan(ctxE, {'0': infoE['0'], '1': infoE['1']})[1]
        t('pairs: a missing pair says which kept photos could not serve and why', 'face' in miss_e and 'short side 640' in ctxE.pair_gaps.get('face', ''), str(ctxE.pair_gaps))

        class FakeR:
            calls = []

            @staticmethod
            def get(url, tries=3):
                FakeR.calls.append(url)
                b = io.BytesIO()
                Image.new('RGB', (3000, 2000), (90, 90, 90)).save(b, 'JPEG')
                return b.getvalue()
        jsave(ctxE.rc + '/cands.json', [{'thumb': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/X.jpg/400px-X.jpg', 'w': 3000, 'h': 2000},
                                        {'thumb': 'https://x/small.jpg', 'w': 800, 'h': 600}])
        inf_ = {}
        r0_, r1_ = pair_photo(ctxE, FakeR, {'i': 0}, inf_), pair_photo(ctxE, FakeR, {'i': 1}, inf_)
        t('pairs: the copy is the original (Commons width asked), long side brought to 2 400; a small original is not fetched', '/3000px-X.jpg' in FakeR.calls[0]
          and len(FakeR.calls) == 1 and (r0_.get('w'), r0_.get('h'), r0_.get('short')) == (2400, 1600, 1600) and os.path.exists(ctxE.rc + '/p000.jpg')
          and r1_.get('short') == 600 and 'original 800x600' in r1_.get('err', ''), str((FakeR.calls, r0_, r1_)))
        # the colour audit: a coloris:rouge photo whose flower is yellow leaves the pairs of rouge, and is said
        shutil.copyfile(HERE + '/refs.py', tmp + '/fleur/refs.py')
        ctxA = Ctx('fx-a2', tmp, argparse.Namespace(dry=False, cap=40, claude=fake), {'sid': 'fx-a2', 'taxon': 'Test test', 'steps': {}, 'skus': []})
        for i_, col in ((0, (200, 40, 60)), (1, (230, 200, 40))):
            im = Image.new('RGB', (400, 300), (128, 128, 128))
            ImageDraw.Draw(im).ellipse([110, 60, 290, 240], fill=col)
            im.save('%s/t%03d.jpg' % (ctxA.rc, i_), quality=95)
        jsave(ctxA.rc + '/cands.json', [{'thumb': 'u0'}, {'thumb': 'u1'}])
        ka = [dict(KEEP[0], i=0, tags=['stade:ouvert', 'vue:face', 'coloris:rouge']), dict(KEEP[0], i=1, tags=['stade:ouvert', 'vue:face', 'coloris:rouge'])]
        jsave(ctxA.rc + '/keep.json', ka)
        jsave(ctxA.rc + '/coloris.json', [{'id': 'rouge', 'cultivar': '', 'corps': '#c8283c'}])
        au_ = cw_photo_audit(ctxA)
        qa_ = open(ctxA.rc + '/questions.md', encoding='utf-8').read() if os.path.exists(ctxA.rc + '/questions.md') else ''
        t('refs: colour audit: a coloris: photo of the right colour stays, one at dE > 15 leaves the pairs and is reported', au_.get('0', {}).get('rouge', {}).get('ok') is True
          and au_.get('1', {}).get('rouge', {}).get('ok') is False and 'photo 1 (coloris:rouge)' in qa_, str(au_) + qa_[-200:])
        pa_ = pair_plan(ctxA, {'0': {'short': 1200, 'file': 'x0'}, '1': {'short': 1200, 'file': 'x1'}})[0]
        t('pairs: the cw- pair takes the photo that passed the colour audit', [p['photo'] for p in pa_ if p['k'] == 'cw-rouge'] == [0], str([(p['k'], p['photo']) for p in pa_]))
        t('prompts: refs asks groupe= and says the 1 000 px and the colour audit', all(x in open('%s/pipe/prompts/refs.md' % HERE, encoding='utf-8').read()
                                                                                  for x in ('groupe=', '1 000 px', 'ΔE 15', '<<groupes>>')))
        t('prompts: finition knows the colour rule', all(x in open('%s/pipe/prompts/finition.md' % HERE, encoding='utf-8').read() for x in ('cwmed.py', 'dL', 'dC')))
        t('prompts: forme names its proofs (refaire.sh face, rtest.sh, the journal lines)', all(x in P_['forme'] or x in open('%s/pipe/prompts/forme.md' % HERE, encoding='utf-8').read()
                                                                                      for x in ('refaire.sh face', 'rtest.sh', 'paire face | photo W/H', '<<rtest>>')))
        say('selftest: %d ok, %d failed' % (len(ok), len(bad)))
    finally:
        LOCKS, need_servers, RUN_PAIRS = old_locks, old_ns, old_rp
        for k, v in old_env.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v
        shutil.rmtree(tmp, ignore_errors=True)
    return 1 if bad else 0


def make_parser():
    ap = argparse.ArgumentParser(prog='pipe.py', description=__doc__.split('\n')[0])
    sp = ap.add_subparsers(dest='cmd', required=True)
    r = sp.add_parser('run')
    r.add_argument('sid')
    r.add_argument('--taxon')
    r.add_argument('--family')
    r.add_argument('--genus')
    r.add_argument('--group')
    r.add_argument('--kavb', action='store_true')
    r.add_argument('--max', type=int, help='most KAVB lookups (census.py --max)')
    r.add_argument('--ch', help='working copy: a name under flower-atelier/ch or a path (default: the copy this script is in)')
    r.add_argument('--cw-pairs', dest='cw_pairs', type=int, default=10, help='colourways compared to the photo of their own variety (comparaison)')
    r.add_argument('--from', dest='from_', choices=STEPS)
    r.add_argument('--only', choices=STEPS)
    r.add_argument('--cap', type=float, default=40.0, help='millions of Opus input-equivalent tokens: a measure kept in pipe-bill.json, the run stops beyond it')
    r.add_argument('--skus', default='', help='bouquet SKUs "lilas~0:Ruhm von Horstenstein,..." (default: sku_bouquet of the sources json)')
    r.add_argument('--dry', action='store_true', help='no model, no command: print what would run and run the disk checks')
    r.add_argument('--claude', help='path of the claude binary (default: the newest of the desktop application)')
    r.add_argument('--max-coloris', dest='max_coloris', type=int, default=60)
    r.add_argument('--qa-total', dest='qa_total', type=int, default=30)
    r.add_argument('--budget', type=int, default=60, help='fit.py --budget')
    r.add_argument('--cw', help='fit.py --cw')
    r.add_argument('--relays', type=int, default=4, help='most fresh Opus calls in one modelling step')
    r.add_argument('--full', type=int, default=40, help='stem length in cm of the plant sheet')
    r.add_argument('--opus-effort', dest='opus_effort', choices=['low', 'medium', 'high', 'xhigh', 'max'], help='--effort of the Opus calls (default xhigh)')
    r.add_argument('--skip-census', dest='skip_census', action='store_true', help='a census exists already (census.json, or catalogue/serre/sources/<sid>.json imported)')
    r.add_argument('--kit', help='a published kit piece the sort extends (app/y3-rose.js...): the sorts already drawn with it must not change')
    r.add_argument('--kit-prefix', dest='kit_prefix', help='the kit family prefix (default: inferred from the module, e.g. svRose|SVROSE_)')
    r.add_argument('--kit-sids', dest='kit_sids', help='the sorts already drawn with the kit, comma separated (default: found in app/y-*.js)')
    r.add_argument('--late', type=int, help='the late:N wave of the colourways added (default 1)')
    r.add_argument('--views', help='grid views of the head pairs for this sort, "profil:8,bouton:8" (default: PAIRS, then the form family: orchids and spathes 8)')
    r.add_argument('--juge-tours', dest='juge_tours', type=int, default=JUGE_TOURS, help='judge ko -> comparaison round trips before the refusal (exit 2)')
    r.add_argument('--groupes', help='the groups a comparison photo may show, among hybride-de-coupe, jardin, espece-sauvage (default "%s"; never autre)' % PAIR_GROUPES)
    r.add_argument('--rtest-bouge', dest='rtest_bouge', help='the owner accepts that the sort moves the bouquets (real-size heads, curved wilted neck): its reason; '
                   'a changed rtest of the sort is then reported in the journal, not blocking')
    for n in ('status', 'bill'):
        s = sp.add_parser(n)
        s.add_argument('sid')
        s.add_argument('--ch')
    sp.add_parser('selftest')
    s = sp.add_parser('locbox', help='the crop of a plant render (shot json with loc=1) for the pairs feuille and tige: x0,y0,x1,y1')
    s.add_argument('json')
    s.add_argument('kind', choices=['feuille', 'tige'])
    s = sp.add_parser('rtsum', help='the journal line of an rtest output file (rtest | IDENTIQUE, or n bouquets changés sur N)')
    s.add_argument('file')
    m = sp.add_parser('models')
    m.add_argument('--ch')
    m.add_argument('--which', default='haiku,sonnet,opus')
    m.add_argument('--claude')
    return ap


def main():
    a = make_parser().parse_args()
    return {'run': cmd_run, 'status': cmd_status, 'bill': cmd_bill, 'models': cmd_models, 'selftest': cmd_selftest, 'rtsum': cmd_rtsum, 'locbox': cmd_locbox}[a.cmd](a)


if __name__ == '__main__':
    sys.exit(main())
