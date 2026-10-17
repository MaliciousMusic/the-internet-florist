"""fakeclaude.py: a stand-in for `claude -p` used by `pipe.py selftest` (no model, no network).
It reads FAKE_SEQ (a json file holding a list of modes), pops the first mode and answers in the stream-json format of Claude Code:
  done | relay | blocked | maxturns | hang | crash
or a dict {"mode": one of those, "final": "<last line>", "read": ["<path>", ...], "write": {"<path>": "<text>", ...}}: the files of "write" are
written (relative to the current directory, in order) and each path of "read" shows in the stream as a Read tool call, as a model would.
Usage numbers are fixed so the bill can be checked: input 10, cache write 1000, cache read 2000, output 100 (haiku)."""
import sys, os, json, time

modes = json.load(open(os.environ['FAKE_SEQ'])) if os.path.exists(os.environ.get('FAKE_SEQ', '')) else ['done']
spec = modes.pop(0) if modes else 'done'
json.dump(modes, open(os.environ['FAKE_SEQ'], 'w'))
spec = spec if isinstance(spec, dict) else {'mode': spec}
mode = spec.get('mode', 'done')
sys.stdin.read()
model = 'claude-haiku-5-5'
for a, b in zip(sys.argv, sys.argv[1:]):
    if a == '--model':
        model = b
u = {'input_tokens': 10, 'cache_creation_input_tokens': 1000, 'cache_read_input_tokens': 2000, 'output_tokens': 100}
print(json.dumps({'type': 'system', 'subtype': 'init', 'model': model}), flush=True)
for p, t in (spec.get('write') or {}).items():
    d = os.path.dirname(p)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(p, 'w', encoding='utf-8', newline='\n') as f:
        f.write(t)
uses = [{'type': 'tool_use', 'id': 'tu%d' % i, 'name': 'Read', 'input': {'file_path': p}} for i, p in enumerate(spec.get('read') or [])]
print(json.dumps({'type': 'assistant', 'message': {'id': 'm1', 'model': model, 'usage': dict(u, output_tokens=5), 'content': [{'type': 'text', 'text': 'working'}] + uses}}), flush=True)
if mode == 'hang':
    time.sleep(120)
if mode == 'crash':
    sys.stderr.write('boom: fake crash\n')
    sys.exit(3)
final = spec.get('final') or {'done': '{"status":"done","note":"ok"}', 'relay': '{"status":"relay"}', 'blocked': '{"status":"blocked","question":"which one?"}', 'maxturns': ''}[mode]
r = {'type': 'result', 'subtype': 'error_max_turns' if mode == 'maxturns' else 'success', 'is_error': False, 'num_turns': 7, 'result': 'text\n' + final if final else '',
     'usage': u, 'modelUsage': {model: {'inputTokens': 10, 'outputTokens': 100, 'cacheReadInputTokens': 2000, 'cacheCreationInputTokens': 1000}},
     'total_cost_usd': 0.01, 'permission_denials': [{'tool_name': 'Bash'}] if mode == 'relay' else []}
print(json.dumps(r), flush=True)
