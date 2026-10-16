"""pack.py <engine dir> <dist dir>: gzip (zopfli) then base64 of the minified engine, the stored bytes; the sample pages.

dist/engine.min.js.gz   the gzip of dist/engine.min.js (zopfli, 15 iterations)
dist/engine.b64         its base64: exactly the bytes BelaiEngine stores, chunk after chunk
dist/fixture.html       the page of a fixed sample, byte for byte what html(7, 1767225600, 41, seed, [20,2541,1952], [12,5,3]) returns
dist/samples/t<n>.html  the same bouquet aged n days (bud, bloom, decline, faded), to open in a browser
"""
import base64, hashlib, math, os, sys, time

import zopfli.gzip as zg

E, D = sys.argv[1], sys.argv[2]
CHUNK = 24575  # one SSTORE2 pointer: 24 576 bytes of code at most, the first one a STOP

js = open(os.path.join(D, 'engine.min.js'), 'rb').read()
gz = zg.compress(js, numiterations=15)
open(os.path.join(D, 'engine.min.js.gz'), 'wb').write(gz)
b64 = base64.b64encode(gz)
open(os.path.join(D, 'engine.b64'), 'wb').write(b64)

head, mid, tail = (open(os.path.join(E, 'page', n + '.html'), 'rb').read() for n in ('head', 'mid', 'tail'))


def page(token_id, created_at, vase_id, seed, skus, amounts):
    """The page as the contract writes it: the BELAI data without spaces, the seed as 0x + 64 lowercase hex digits."""
    data = '{"id":%d,"createdAt":%d,"vaseId":%d,"seed":"0x%064x","skus":[%s],"amounts":[%s]}' % (
        token_id, created_at, vase_id, seed, ','.join(map(str, skus)), ','.join(map(str, amounts)))
    return head + data.encode() + mid + b64 + tail


SAMPLE = dict(vase_id=41, seed=0x5eed00c0ffee << 200, skus=[20, 2541, 1952], amounts=[12, 5, 3])
open(os.path.join(D, 'fixture.html'), 'wb').write(page(7, 1767225600, **SAMPLE))
now = int(time.time())
for age in (1, 10, 25, 35):
    open(os.path.join(D, 'samples', 't%d.html' % age), 'wb').write(page(7, now - age * 86400, **SAMPLE))

kb = lambda b: '%d Ko' % round(len(b) / 1024)
print('engine.min.js', kb(js), '| gzip', kb(gz), '| base64', kb(b64), '(%d octets, %d morceaux)' % (len(b64), math.ceil(len(b64) / CHUNK)),
      '| page', kb(page(7, 0, **SAMPLE)))
print('sha256(engine.b64)', hashlib.sha256(b64).hexdigest())
