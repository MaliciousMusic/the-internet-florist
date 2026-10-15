import re, sys
s = open(sys.argv[1]).read()
defs = s[s.index('<defs>'):s.index('</defs>')]
body = s[s.index('<g id="vase">'):]
print('total', len(s), 'defs', len(defs))
for cid, inner in re.findall(r'<g clip-path="url\(#(c\w+)\)">(.*?)</g></g>', body):
    print(' ', cid, len(inner), inner.count('<path'))
print('  lines', sum(len(x) for x in re.findall(r'<path fill="#7a5a3c"[^>]*>', body)))
print('  outlines', sum(len(x) for x in re.findall(r'<path fill="none" stroke="url\(#gline\)"[^>]*>', body)))
