"""Check native drawings and all internal references without running a renderer."""
from pathlib import Path
import hashlib
import json
import re
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parent
BLOCKED={'image','script','foreignObject','feDiffuseLighting','feSpecularLighting','feDistantLight','fePointLight','feSpotLight','feTurbulence','feDisplacementMap','animate','animateTransform'}
manifest=json.loads((ROOT/'compositions.json').read_text(encoding='utf-8'))
items=manifest['items']
assert len(items)==40
assert manifest['references']==['021','065','085','103']
assert len({i['id'] for i in items})==40
report=[]
for item in items:
    file=ROOT/item['file']
    data=file.read_bytes()
    text=data.decode('utf-8')
    root=ET.fromstring(text)
    assert root.attrib['viewBox']=='0 0 320 400'
    assert root.attrib['width']=='320' and root.attrib['height']=='400'
    ids=[node.attrib['id'] for node in root.iter() if 'id' in node.attrib]
    assert len(ids)==len(set(ids)),item['id']
    refs=re.findall(r'url\(#([\w-]+)\)',text)
    for node in root.iter():
        assert node.tag.rsplit('}',1)[-1] not in BLOCKED,item['id']
        for attr,val in node.attrib.items():
            if attr.rsplit('}',1)[-1]=='href':
                assert val.startswith('#'),(item['id'],val)
                refs.append(val[1:])
            assert not attr.startswith('on'),item['id']
    assert set(refs).issubset(ids),(item['id'],set(refs)-set(ids))
    assert 'data:' not in text and 'https:' not in text
    assert len(data)<30000,item['id']
    sha=hashlib.sha256(data).hexdigest()
    assert sha==item['sha256']
    assert ('monture' in ids)==item['mounted']
    assert all(k in ids for k in ['silhouette','decor','ouverture','appui-continu'])
    report.append({'id':item['id'],'bytes':len(data),'paths':sum(n.tag.endswith('}path') for n in root.iter()),'sha256':sha,'xmlValid':True,'selfContained':True,'native2dOnly':True,'mounted':item['mounted']})
assert len({i['sha256'] for i in report})==40
assert sum(i['mounted'] for i in items)==20
assert sum(i['animal'] for i in items)==20
(ROOT/'verification.json').write_text(json.dumps({'count':40,'items':report},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('40 SVG autonomes distincts vérifiés ; 20 libres et 20 montés, aucun bitmap ni éclairage 3D.')
