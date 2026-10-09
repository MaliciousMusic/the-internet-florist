#!/usr/bin/env python
"""pipe.py: the deterministic pilot of ONE flower sort through the whole /fleur method (Belai's Flowers).

  python fleur/pipe.py run <sid> --taxon "<Genus species>" [--family F] [--ch <copy>] [--from <step>] [--only <step>] [--cap <M>]
                              [--skus "lilas~0:Ruhm von Horstenstein,..."] [--genus G] [--group "..."] [--kavb] [--dry]
  python fleur/pipe.py status <sid>      the steps, their checks, the bill so far
  python fleur/pipe.py bill <sid>        the bill by step, in Opus input-equivalent tokens
  python fleur/pipe.py models            three tiny calls: which models the chosen CLI accepts (bills them under refcache/pipe-test)

Every step that needs a model is a fresh `claude -p` call (short prompt, empty context, closed tool list, capped turns); between two
steps the checks are numbers computed here in Python. State: refcache/<sid>/pipe-state.json (resume with --from), bill:
refcache/<sid>/pipe-bill.json (one line per call). Steps: census refs coloris targets forme fit plante finition temoins qa planches.
Rules kept from the method: one Opus at a time per working copy, three sorts at most on the PC (ws/locks/pipe-<n>), renders through
the gate (shot.sh), no commit and no merge anywhere, never a process that this script did not start itself."""
import sys, os, re, json, time, math, glob, shutil, argparse, subprocess, threading, queue, contextlib, io, importlib.util, unicodedata, statistics

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
MAIN = 'C:/Users/agent/Desktop/flower-atelier'  # the shared atelier: gate, locks, servers (never modified here)
FC = 'C:/Users/agent/Desktop/flower-claude'     # the repository: standards read here, sheets copied there, never committed
STEPS = ['census', 'refs', 'coloris', 'targets', 'forme', 'fit', 'plante', 'finition', 'temoins', 'qa', 'planches']
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
TURNS = {'haiku': 40, 'sonnet': 40, 'opus': 36}          # --max-turns per call
LIMIT = {'haiku': 1200, 'sonnet': 1800, 'opus': 3000}   # wall-clock seconds per call
EFFORT = {'haiku': 'low', 'sonnet': 'medium', 'opus': 'medium'}
TARGET_EL, TARGET_KB = 300, 50                          # budget per head at DET 1; red beyond 1.2 x
SYSTEM = ("You are one worker of a scripted pipeline for Belai's Flowers (a flower game: stems, bouquets, auction house). Work in the current "
          "directory only. Every Bash command prints 20 lines at most (pipe to head or tail; details go to files read by chunks). Write files in "
          "French for docs and reports, English for code and comments. Game vocabulary only (never invest, yield, trading, speculation). "
          "No 3D, no embedded images, no ribbons, never a bulb, root or soil. No git commit, merge or push. Never stop, kill or suspend a "
          "process you did not start; never use port 8766. No secret in any file. Third-party photos stay in refcache/. "
          "Your LAST line is one single-line JSON object as the step asks; nothing after it.")
DENY = ['Bash(kill*)', 'Bash(taskkill*)', 'Bash(*Stop-Process*)', 'Bash(pkill*)', 'Bash(rm -rf*)', 'Bash(git commit*)', 'Bash(git push*)',
        'Bash(git merge*)', 'Bash(git reset*)', 'Bash(*8766*)']
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
        L = ['%-10s %5s %6s %9s %9s %10s %8s %9s %6s' % ('step', 'calls', 'turns', 'in', 'cache-w', 'cache-r', 'out', 'eq-Opus', 'share')]
        for k in order:
            s = by[k]
            L.append('%-10s %5d %6d %9d %9d %10d %8d %9d %5.0f%%' % (k, s['calls'], s['turns'], s['in'], s['cw'], s['cr'], s['out'], s['eq'], 100 * s['eq'] / tot))
        mod = {}
        for r in self.rows():
            mod[r['model']] = mod.get(r['model'], 0) + r.get('eq', 0)
        L.append('%-10s %5d %6d %9d %9d %10d %8d %9d' % ('TOTAL', sum(s['calls'] for s in by.values()), sum(s['turns'] for s in by.values()),
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
        self.cap = float(getattr(a, 'cap', 3)) * 1e6
        self.bill = Bill(self.rc + '/pipe-bill.json')
        self.claude = getattr(a, 'claude', None) or find_claude()
        self.rel_url = fwd(os.path.relpath(self.ch, MAIN)) if fwd(self.ch).startswith(MAIN) else ''  # ch/outils, in the server's URLs
        self.lock_opus = None
        os.makedirs(self.rc + '/pipe-logs', exist_ok=True)

    @property
    def taxon(self):
        return self.st['taxon']

    @property
    def genus(self):
        return self.st.get('genus') or self.taxon.split()[0]

    def sub(self, **kw):
        base = dict(sid=self.sid, taxon=self.taxon, genus=self.genus, family=self.st.get('family') or '', rc=self.rel,
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
        say('  [dry] $ ' + line[:200])
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
        say('  [dry] model call %s/%s: %s, %d turns max, tools %s, prompt %d lines %d chars' % (step, tag, MODELS[model], turns, ','.join(builtin), nlines, len(prompt)))
        return {'ok': True, 'dry': True, 'final': {'status': 'dry'}, 'text': '', 'subtype': 'dry', 'maxturns': False, 'timeout': False, 'eq': 0, 'turns': 0, 'ctx_peak': 0, 'denials': 0}
    n = len(glob.glob('%s/pipe-logs/*.jsonl' % ctx.rc)) + 1
    logp = '%s/pipe-logs/%02d-%s-%s.jsonl' % (ctx.rc, n, step, tag)
    t0 = time.time()
    errf = open(logp + '.err', 'wb')
    p = subprocess.Popen(cmd, cwd=ctx.ch, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=errf, env=child_env())
    st = {'result': None, 'msgs': {}, 'order': [], 'peak': 0}
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
    out = {'ok': bool(r) and not r.get('is_error'), 'final': parse_final(text), 'text': text, 'subtype': sub, 'maxturns': sub == 'error_max_turns', 'timeout': timed,
           'eq': eq, 'turns': (r or {}).get('num_turns', len(st['order'])), 'ctx_peak': st['peak'], 'denials': len((r or {}).get('permission_denials') or [])}
    ctx.bill.add(dict(row_u, step=step, tag=tag, model=model, eq=round(eq), usd=(r or {}).get('total_cost_usd'), turns=out['turns'], dur=round(dur), ctx_peak=st['peak'],
                      denials=out['denials'], ok=out['ok'], subtype=sub, ts=now(), log=os.path.basename(logp)))
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


def need_servers(ctx):
    if ctx.dry:
        return
    for port, what in ((8765, 'the atelier server'), (8781, 'recv.py')):
        if not server_up(port):
            raise StepFailed('%s (port %d) is not running: start it (never 8766) and resume with --from %s' % (what, port, ctx.st.get('current')))


def ensure_docs(ctx):
    """copies of the standards the models need, inside the working copy (cwd of every call): no --add-dir, no write access to flower-claude"""
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


def bouquet_skus(a, sid):
    """[{sku, cultivar}] from --skus "lilas~0:Ruhm von Horstenstein,..." or, read-only, from flower-claude's sources json (sku_bouquet)"""
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
        br = str(v.get('marque') or ('a_verifier' if hint else 'libre')).lower()
        br = 'deposee' if br.startswith('dep') else 'a_verifier' if br.startswith('a_') or br.startswith('à') else 'libre'
        syn = c.get('synonymes') or []
        out.append({'nom': n, 'niveau': lvl if lvl in 'ABCD' else 'D', 'marque': br, 'photos': c.get('photos') or [], 'verdict': bool(v),
                    'names': [norm(n)] + [norm(s) for s in (syn if isinstance(syn, list) else str(syn).split(','))], 'groupe': c.get('groupe')})
    return out


def sku_cultivar(rows, cname):
    k = norm(cname)
    if not k:
        return None
    hit = [r for r in rows if k in r['names']] or [r for r in rows if any(k in n or (n and n in k) for n in r['names'])]
    return sorted(hit, key=lambda r: 'AB'.find(r['niveau']) if r['niveau'] in 'AB' else 9)[0] if hit else None


def check_census(ctx):
    rows = census_table(ctx)
    if not rows:
        return {'ok': False, 'msg': 'census.json missing or without cultivars'}
    lv = {k: sum(1 for r in rows if r['niveau'] == k) for k in 'ABCD'}
    good = [r for r in rows if r['niveau'] in 'AB' and r['marque'] == 'libre']
    waiting = [r['nom'] for r in rows if r['marque'] == 'a_verifier']
    if waiting:
        open(ctx.rc + '/marques-a-verifier.txt', 'w', encoding='utf-8').write('\n'.join(waiting) + '\n')
    bad, unresolved = [], []
    for x in ctx.st.get('skus', []):
        r = sku_cultivar(rows, x.get('cultivar'))
        if r is None:
            unresolved.append(x['sku'])
        elif not (r['niveau'] in 'AB' and r['marque'] == 'libre'):
            bad.append('%s (%s: level %s, brand %s)' % (x['sku'], r['nom'], r['niveau'], r['marque']))
    ok = not bad and bool(good) and (len(unresolved) < len(ctx.st.get('skus', [])) or not ctx.st.get('skus'))
    msg = '%d cultivars, A %d B %d C %d D %d, %d A/B free of brand, %d brand to check' % (len(rows), lv['A'], lv['B'], lv['C'], lv['D'], len(good), len(waiting))
    if bad:
        msg += '; BOUQUET SKU WITHOUT A/B: ' + ', '.join(bad)
    if unresolved:
        msg += '; SKU cultivar not found in the census: ' + ', '.join(unresolved)
    return {'ok': ok, 'msg': msg, 'levels': lv, 'good': len(good)}


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
    todo = [b for b in batches if not os.path.exists(b.replace('douteux-', 'verdict-'))]
    say('  %d doubtful batches, %d to settle with Haiku' % (len(batches), len(todo)))

    def one(b):
        n = re.findall(r'\d+', os.path.basename(b))[0]
        for k in (1, 2):  # a second pass finishes a batch cut by the turn cap
            p = prompt_text('census', **ctx.sub(n=n, batch='%s/census/douteux-%s.json' % (ctx.rel, n), verdict='%s/census/verdict-%s.json' % (ctx.rel, n)))
            r = call_model(ctx, 'census', 'lot%s.%d' % (n, k), 'haiku', p, READ + ['Write'] + WEB + ['Bash(python *)', 'Bash(ls *)', 'Bash(head *)', 'Bash(tail *)', 'Bash(cat *)', 'Bash(wc *)'], turns=60)
            if (r.get('final') or {}).get('status') == 'done' or ctx.dry:
                return
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=min(3, max(1, len(todo)))) as ex:
        futs = [ex.submit(one, b) for b in todo]
        for f in futs:
            f.result()
    c = check_census(ctx)
    if not c['ok'] and 'BOUQUET SKU WITHOUT A/B' in c['msg'] and not os.path.exists(d + '/verdict-900.json'):
        # the bouquet's cultivars below B get one targeted Haiku search for N2/N3 photos (lot 900), then the check again
        raw = {norm(x.get('nom', '')): x for x in jload(d + '/census.json', {}).get('cultivars', [])}
        lot = []
        for x in ctx.st.get('skus', []):
            k = norm(x.get('cultivar') or '')
            r = raw.get(k) or next((v for n, v in raw.items() if k and n and (n in k or k in n)), None)  # same loose match as sku_cultivar
            if r is not None:
                lot.append(dict(r, consigne='SKU du bouquet %s sous le niveau B : cherche par WebSearch ciblée au moins une photo nommée N2 ou N3 de ce cultivar '
                                         '(obtenteur, arboretum, jardin botanique, collection nationale, société du genre, pépinière spécialisée) et une seconde photo '
                                         'indépendante ; donne les URL des images. Si rien ne se trouve, dis-le.' % x['sku']))
        if lot:
            say('  bouquet cultivars below B: one targeted search (lot 900)')
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
REFS_HARD = [('stade', 'bouton'), ('stade', 'ouvert'), ('stade', 'fane'), ('organe', 'feuille-dessus'), ('organe', 'tige')]


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
    if not jload(ctx.rc + '/keep.json', []) or ctx.dry:
        sh = '' if ctx.dry else '\n'.join('- ' + s for s in sheets)
        r = call_model(ctx, 'refs', 'pick', 'haiku', prompt_text('refs', **ctx.sub(task='pick', sheets=sh or '-', missing='-')), tools, turns=45)
    c = check_refs(ctx)
    if not c['ok'] or len(c['soft']) > 3:
        miss = ', '.join(c['hard'] + c['soft'])
        r = call_model(ctx, 'refs', 'fill', 'haiku', prompt_text('refs', **ctx.sub(task='fill', sheets='-', missing=miss or '-')), tools + WEB + ['Write'], turns=45)
        c = check_refs(ctx)
    if not ctx.dry and c['n']:
        quiet(R.kept, ctx.sid, 220)
    if not os.path.exists(ctx.rc + '/brief.md') or ctx.dry:
        call_model(ctx, 'refs', 'brief', 'haiku', prompt_text('brief', **ctx.sub()), tools + ['Write'], turns=30)
    if not ctx.dry and not os.path.exists(ctx.rc + '/brief.md'):
        c['ok'], c['msg'] = False, c['msg'] + '; brief.md not written'
    return {'status': 'done' if c['ok'] else 'failed', 'msg': c['msg'], 'checks': c, 'gaps': c['soft']}


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
    rows = [r for r in census_table(ctx) if r['niveau'] in 'AB' and r['marque'] == 'libre' and r['photos']]
    if not rows:
        raise StepFailed('no A/B cultivar with photos in the census (run census first)')
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
        cid = slug(r['nom'])[:24] or 'c'
        while cid in used:
            cid += 'x'
        used.add(cid)
        e = {'id': cid, 'cultivar': r['nom'], 'niveau': r['niveau'], 'photos': [m['page'] for m in res], 'mesure': 'auto'}
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
        if all(re.match(r'^#[0-9a-fA-F]{6}$', str(e.get(k) or '')) for k in ('base', 'corps', 'pointe')) and e['niveau'] in 'AB':
            keep.append(e)
        else:
            drop.append({'id': e['id'], 'cultivar': e['cultivar'], 'raison': 'no measure'})
    jsave(ctx.rc + '/coloris.json', keep)
    jsave(ctx.rc + '/coloris-ecartes.json', drop)
    L = ['# Coloris mesurés de %s (%d, %d écartés)' % (ctx.sid, len(keep), len(drop)), '', '| id | cultivar | base | corps | pointe | revers | macule | niveau | remarques |', '|---|---|---|---|---|---|---|---|---|']
    for e in keep:
        L.append('| %s | %s | %s | %s | %s | %s | %s | %s | %s |' % (e['id'], e['cultivar'], e['base'], e['corps'], e['pointe'], e.get('revers') or '', e.get('macule') or '', e['niveau'],
                 '%s, dE %s, %d photos' % (e['mesure'], e.get('ecart_dE', '-'), len(e['photos']))))
    open(ctx.rc + '/coloris.md', 'w', encoding='utf-8').write('\n'.join(L) + '\n')
    allr, kept_ids, ids = census_table(ctx), {e['id'] for e in keep}, {e['cultivar']: e['id'] for e in out}
    miss = []
    for x in ctx.st.get('skus', []):
        r = sku_cultivar(allr, x.get('cultivar'))
        if r is not None and ids.get(r['nom']) not in kept_ids:  # a SKU whose cultivar is not in the census is the census check's business
            miss.append(x['sku'])
    ok = bool(keep) and not miss
    return {'status': 'done' if ok else 'failed', 'msg': '%d colourways measured, %d dropped, %d sent to Haiku%s' % (len(keep), len(drop), len(low), '; bouquet SKU without colour: ' + ', '.join(miss) if miss else ''),
            'checks': {'kept': len(keep), 'dropped': len(drop), 'low': len(low)}}


# ---------------------------------------------------------------------------------------------------------------- targets

def targets_cmd(ctx):
    """fit.py targets on the kept photos; the form family (grappe: an inflorescence, not a radial flower) is passed on, fit.py decides what it means"""
    cmd = [sys.executable, 'fleur/fit.py', 'targets', ctx.sid, '--refs', ctx.rel, '--out', ctx.rel + '/targets.json']
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


# ---------------------------------------------------------------------------------------------------------------- Opus / Sonnet loops

LOCKED = ('forme', 'fit', 'plante', 'finition', 'temoins', 'qa', 'planches')  # they edit, rebuild or render the working copy: one at a time per copy


def get_lock(ctx, kind):
    """one Opus at a time per working copy (and nobody rebuilding it meanwhile): held by the runner around the steps of LOCKED"""
    lk = Lock([kind + '-' + os.path.basename(ctx.ch)], ctx.sid)
    if not ctx.dry:
        lk.acquire(wait=True)
    return lk


def model_loop(ctx, step, pname, model, tools, max_calls, done_check, turns=None, extra=None):
    """calls with an empty context until the model says done AND the check passes; a call that stops on the turn cap, the clock or 'relay' is
    followed by a fresh one that reads etat-<step>.md (written by the model, or by us as a stub). Returns ('done'|'relay'|'blocked', last final)"""
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
        if fin.get('status') == 'blocked':
            return 'blocked', fin
        if fin.get('status') == 'done' and not r['timeout']:
            ok, why = done_check()
            if ok:
                return 'done', fin
            say('  %s: check failed: %s' % (step, why[:200]))
        else:
            why = ''
            p = ctx.rc + '/etat-%s.md' % step
            if not os.path.exists(p) or os.path.getmtime(p) < t0:
                open(p, 'w', encoding='utf-8').write('# État (écrit par pipe.py)\n\nL\'appel %d de l\'étape %s s\'est arrêté (%s, %d tours) sans écrire son état.\n'
                                                     'Lis la fin de journal.md et `git status --short` pour voir ce qui est fait, puis continue.\n' % (k, step, r['subtype'], r['turns']))
    return 'relay', fin


def check_forme(ctx, space='space.json'):
    g = slug(ctx.genus)
    why = []
    js = 'app/y-%s.js' % g
    if not have(ctx, js):
        why.append(js + ' missing')
    else:
        for f in ('mkapp.sh', 'mkqa.sh', 'mkpl.sh'):
            try:
                if 'y-%s.js' % g not in open('%s/%s' % (ctx.ch, f), encoding='utf-8').read():
                    why.append('y-%s.js not registered in %s' % (g, f))
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
    return (not why), '; '.join(why)


def step_forme(ctx):
    ensure_docs(ctx)
    tools = READ + ['Write', 'Edit'] + SAFE_BASH
    res, fin = model_loop(ctx, 'forme', 'forme', 'opus', tools, int(getattr(ctx.a, 'relays', 4)), lambda: check_forme(ctx))
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
    cmd = [sys.executable, 'fleur/fit.py', ctx.sid, '--space', '%s/%s' % (ctx.rel, space), '--targets', ctx.rel + '/targets.json', '--budget', str(getattr(ctx.a, 'budget', 60)), '--out', '%s/%s' % (ctx.rel, outdir)]
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
                   READ + ['Write', 'Edit'] + SAFE_BASH, turns=26)  # 16 ran out on a lilac look (a render with the wrong sid, then the journal)
    fin = r.get('final') or {}
    ok = ctx.dry or (fin.get('status') == 'done' and os.path.exists(d + '/fit.png'))
    return {'status': 'done' if ok else 'failed', 'msg': '%s; look: %s' % (summ, fin.get('verdict') or fin.get('note') or r['subtype']), 'checks': {'fit_png': os.path.exists(d + '/fit.png')}}


def step_plante(ctx):
    ensure_docs(ctx)
    res, fin = model_loop(ctx, 'plante', 'plante', 'opus', READ + ['Write', 'Edit'] + SAFE_BASH, int(getattr(ctx.a, 'relays', 4)), lambda: check_forme(ctx, 'space-plante.json'))
    if res == 'blocked':
        raise StepFailed('plante blocked by the modeller: %s' % (fin.get('question') or fin.get('note') or fin))
    if res != 'done':
        return {'status': 'failed', 'msg': 'plante not finished after the relays (resume with --from plante)'}
    r = step_fit(ctx, 'plante')
    r['msg'] = 'plante done; ' + r['msg']
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
    """fleur/shot.sh through the gate: (png written?, the measures {n, el, kb, patch}, text)"""
    need_servers(ctx)
    code, text = run_cmd(ctx, [sh_exe(), 'fleur/shot.sh', name, query], tag, timeout=1500)
    ok = os.path.exists('%s/fleur/out/%s.png' % (ctx.ch, name)) and 'PAS D\'IMAGE' not in text
    return ok, last_json(text), text


def cw_ids(ctx, n=4):
    ids = [e['id'] for e in jload(ctx.rc + '/coloris.json', [])][:n]
    return ids


STAGES = '.06:0,.2:0,.4:0,.75:0,1:0,1:.35,1:.6,1:.75,1:.9'


def budget(ctx, tag):
    ids = cw_ids(ctx, 2)
    if not ids and not ctx.dry:
        raise StepFailed('no coloris.json: no colourway to measure')
    q = 'grid=1&sid=%s&cws=%s&st=.06:0,.4:0,.85:0,1:.6,1:.9&view=2,0&D=120&det=1' % (ctx.sid, ','.join(ids))
    ok, m, text = shot(ctx, tag, q, 'budget-' + tag)
    if ctx.dry:
        return True, 'dry', {}
    if not ok or not m:
        return False, 'no render (%s)' % (text.strip().splitlines() or [''])[-1][:100], {}
    over = m.get('el', 0) > 1.2 * TARGET_EL or m.get('kb', 0) > 1.2 * TARGET_KB
    return (not over), '%s elements and %s KB per head at DET 1 (target %d / %d, red beyond 1.2 x)' % (m.get('el'), m.get('kb'), TARGET_EL, TARGET_KB), m


def step_finition(ctx):
    def chk():
        ok, msg, m = budget(ctx, 'fin_' + ctx.sid)
        return ok, msg
    res, fin = model_loop(ctx, 'finition', 'finition', 'sonnet', READ + ['Write', 'Edit'] + SAFE_BASH, 2, chk)
    ok, msg, m = budget(ctx, 'fin_' + ctx.sid) if not ctx.dry else (True, 'dry', {})
    return {'status': 'done' if (res == 'done' and ok) else 'failed', 'msg': 'finition %s; %s' % (res, msg), 'checks': m}


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
    url = 'http://localhost:8765/%spilote/sv.html?rtest=1&rc=%s&sv=11&nc=%d' % ((rel_url + '/') if rel_url else '', ','.join(rcs), time.time())
    outp = 'fleur/out/%s.json' % tag
    c, t = run_cmd(ctx, [sh_exe(), 'ws/gate.sh', sh_exe(), 'ws/chrome1.sh', 'dom', url, outp], tag, timeout=1700, quiet=True)
    p = '%s/%s' % (ctx.ch, outp)
    return rtest_parse(open(p, encoding='utf-8', errors='replace').read()) if not ctx.dry and os.path.exists(p) else {}


def step_temoins(ctx):
    out = []
    ok = True
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
            out.append('anemone %s %%' % (pct if pct is not None else '?'))
    # rtest = the bouquet's random stream with the SVG heads off and on (the composition must not move). The sort's own SKUs must be IDENTIQUE;
    # the tulip witnesses must do no worse than in the main atelier (they can already differ there: a failure of the witness is not the sort's)
    own = ['%s:%s' % (x['sku'], x.get('tiges') or 6) for x in ctx.st.get('skus', []) if x.get('sku')]
    wit = ['tulipe-simple~7:7', 'tulipe-simple~12:6']
    need_servers(ctx)
    r_own = rtest_run(ctx, ctx.rel_url, own, 'temoin-rtest') if own else {}
    r_wit = rtest_run(ctx, ctx.rel_url, wit, 'temoin-rtest-tulipes')
    r_ref = rtest_run(ctx, '', wit, 'temoin-rtest-principal') if ctx.rel_url else r_wit
    if not ctx.dry:
        nd_own = [k for k, v in r_own.items() if v != 'IDENTIQUE']
        worse = [k for k, v in r_wit.items() if v != 'IDENTIQUE' and r_ref.get(k) == 'IDENTIQUE']
        known = [k for k, v in r_wit.items() if v != 'IDENTIQUE' and r_ref.get(k) != 'IDENTIQUE']
        ok = ok and bool(r_own) == bool(own) and not nd_own and not worse and bool(r_wit)
        out.append('rtest of the sort %d IDENTIQUE, %d different%s; tulip witnesses %d IDENTIQUE, %d different%s' % (
            len(r_own) - len(nd_own), len(nd_own), ' (%s)' % ', '.join(nd_own) if nd_own else '', len(r_wit) - len(known) - len(worse), len(known) + len(worse),
            ' (%d already so in the main atelier%s)' % (len(known), '; WORSE: ' + ', '.join(worse) if worse else '') if known or worse else ''))
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
        say('  [dry] qawatch.sh by lots of 2 (4.2 to 5 GB free) or 4 (beyond), %d bouquets in all, then the budget' % total)
        done = total
    while done < total:
        waits = 0
        ram = free_ram_gb()
        while ram < 4.2:
            waits += 1
            if waits > 6:
                raise StepFailed('free RAM stayed under 4.2 GB for 12 minutes (%.1f GB): resume with --from qa when the PC is free' % ram)
            say('  RAM %.1f GB, waiting 2 minutes (%d/6)' % (ram, waits))
            time.sleep(120)
            ram = free_ram_gb()
        lot = 2 if ram < 5 else 4
        seed += 1
        url = 'http://localhost:8765/%s/lab/qa13.html?run=composed&n=%d&seed=%d&inc=%s' % (ctx.rel_url, lot, seed, ctx.sid)
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
    ids = cw_ids(ctx, 6)
    if not ids and not ctx.dry:
        raise StepFailed('no coloris.json: no sheet')
    dest = FC + '/catalogue/serre/pilote-printemps/sheets'
    full = int(getattr(ctx.a, 'full', 40) or 40)
    jobs = [('sku', 'grid=1&sid=%s&cws=%s&st=%s&view=2,0,3&D=110' % (ctx.sid, ','.join(ids), STAGES)),
            ('plante', 'plant=1&sid=%s&cw=%s&st=.1:0,.3:0,.6:0,1:0,1:.4,1:.75&axv=1&full=%d' % (ctx.sid, ids[0] if ids else '', full))]
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


STEPFN = {'census': step_census, 'refs': step_refs, 'coloris': step_coloris, 'targets': step_targets, 'forme': step_forme, 'fit': step_fit,
          'plante': step_plante, 'finition': step_finition, 'temoins': step_temoins, 'qa': step_qa, 'planches': step_planches}


# ---------------------------------------------------------------------------------------------------------------- the commands

COMMON_KEYS = {'sid', 'taxon', 'genus', 'family', 'rc', 'skus', 'ch'}
PROMPT_KEYS = {'census': {'n', 'batch', 'verdict'}, 'refs': {'task', 'sheets', 'missing'}, 'brief': set(), 'coloris': {'n', 'low', 'manual'},
               'forme': {'relay', 'etat'}, 'plante': {'relay', 'etat'}, 'finition': {'relay', 'etat'}, 'fit': {'part', 'space', 'out', 'summary'}}


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
    return '%-9s %-8s %7.0f k  %s' % (name, s.get('status', '-'), eq / 1e3, (s.get('msg') or '')[:120])


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
    for k in ('family', 'genus', 'group'):
        if getattr(a, k, None):
            st[k] = getattr(a, k)
    if a.kavb:
        st['kavb'] = True
    sk = bouquet_skus(a, sid)
    if sk or 'skus' not in st:
        st['skus'] = sk
    if getattr(a, 'opus_effort', None):
        EFFORT['opus'] = a.opus_effort
    ctx = Ctx(sid, ch, a, st)
    if not ctx.claude or not os.path.exists(ctx.claude):
        raise SystemExit('no Claude Code binary found (desktop application: %APPDATA%/Claude/claude-code/<version>/*/claude.exe); set PIPE_CLAUDE or --claude')
    st['claude'] = ctx.claude
    st['cap_M'] = a.cap
    names = list(STEPS)
    if a.only:
        todo = [a.only]
    else:
        start = a.from_ or next((n for n in names if st['steps'].get(n, {}).get('status') not in ('done', 'skipped')), None)
        if start is None:
            say('every step is done: nothing to run (use --from <step> to redo)')
            return 0
        todo = names[names.index(start):]
        if a.from_ and not ctx.dry:
            for n in todo:
                st['steps'].pop(n, None)
    bad = validate_prompts()
    if bad:
        raise SystemExit('prompts: ' + '; '.join(bad))
    say('%s (%s): steps %s ; CLI %s ; cap %.1f M ; spent %.2f M%s' % (sid, st['taxon'], ' '.join(todo), os.path.basename(os.path.dirname(os.path.dirname(ctx.claude))) or ctx.claude,
        ctx.cap / 1e6, ctx.bill.total() / 1e6, ' ; DRY RUN' if ctx.dry else ''))
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
    say('-- bill: %.2f M eq-Opus of %.1f M' % (ctx.bill.total() / 1e6, ctx.cap / 1e6))
    return code


def load_ctx(a):
    ch = resolve_ch(getattr(a, 'ch', None))
    st = jload('%s/refcache/%s/pipe-state.json' % (ch, a.sid), None)
    if st is None:
        raise SystemExit('no state for %s in %s' % (a.sid, ch))
    a.cap = st.get('cap_M', 3)
    return Ctx(a.sid, ch, a, st)


def cmd_status(a):
    ctx = load_ctx(a)
    say('%s (%s) in %s ; current %s ; updated %s' % (ctx.sid, ctx.taxon, ctx.ch, ctx.st.get('current'), ctx.st.get('updated')))
    say('%-9s %-8s %9s  %s' % ('step', 'status', 'eq-Opus', 'message'))
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
    global LOCKS
    ok, bad = [], []

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
        res, fin = model_loop(ctx, 'forme', 'forme', 'haiku', ['Read'], 3, lambda: (True, ''))
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
        t('census: bouquet SKU at C with a brand hint fails', not c['ok'], c['msg'])
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
        say('selftest: %d ok, %d failed' % (len(ok), len(bad)))
    finally:
        LOCKS = old_locks
        shutil.rmtree(tmp, ignore_errors=True)
    return 1 if bad else 0


def main():
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
    r.add_argument('--from', dest='from_', choices=STEPS)
    r.add_argument('--only', choices=STEPS)
    r.add_argument('--cap', type=float, default=3.0, help='millions of Opus input-equivalent tokens')
    r.add_argument('--skus', default='', help='bouquet SKUs "lilas~0:Ruhm von Horstenstein,..." (default: sku_bouquet of the sources json)')
    r.add_argument('--dry', action='store_true', help='no model, no command: print what would run and run the disk checks')
    r.add_argument('--claude', help='path of the claude binary (default: the newest of the desktop application)')
    r.add_argument('--max-coloris', dest='max_coloris', type=int, default=60)
    r.add_argument('--qa-total', dest='qa_total', type=int, default=30)
    r.add_argument('--budget', type=int, default=60, help='fit.py --budget')
    r.add_argument('--cw', help='fit.py --cw')
    r.add_argument('--relays', type=int, default=4, help='most fresh Opus calls in one modelling step')
    r.add_argument('--full', type=int, default=40, help='stem length in cm of the plant sheet')
    r.add_argument('--opus-effort', dest='opus_effort', choices=['low', 'medium', 'high', 'xhigh', 'max'], help='--effort of the Opus calls (default medium)')
    for n in ('status', 'bill'):
        s = sp.add_parser(n)
        s.add_argument('sid')
        s.add_argument('--ch')
    sp.add_parser('selftest')
    m = sp.add_parser('models')
    m.add_argument('--ch')
    m.add_argument('--which', default='haiku,sonnet,opus')
    m.add_argument('--claude')
    a = ap.parse_args()
    return {'run': cmd_run, 'status': cmd_status, 'bill': cmd_bill, 'models': cmd_models, 'selftest': cmd_selftest}[a.cmd](a)


if __name__ == '__main__':
    sys.exit(main())
