"""Validate the native artwork, its dependency graph and its private preview."""
from pathlib import Path
import hashlib
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
BLOCKED = {'image', 'script', 'foreignObject', 'feImage', 'feDiffuseLighting',
           'feSpecularLighting', 'feTurbulence', 'feDisplacementMap', 'animate'}


def verify():
    report = json.loads((ROOT / 'verification.json').read_text(encoding='utf-8'))
    assert len(report) == 3
    assert {item['id'] for item in report} == {'013-aurore', '013-onde', '013-brise'}
    for item in report:
        file = ROOT / item['file']
        svg = file.read_text(encoding='utf-8')
        root = ET.fromstring(svg)
        assert root.attrib['viewBox'] == '0 0 320 400'
        ids = [node.attrib['id'] for node in root.iter() if 'id' in node.attrib]
        assert len(ids) == len(set(ids)), 'Duplicate identifier'
        assert {'silhouette', 'decor-reutilisable', 'ouverture', 'epaisseur', 'panse'}.issubset(ids)
        refs = set(re.findall(r'(?:url\(#|href="#)([^)"\s]+)', svg))
        assert refs.issubset(ids), refs - set(ids)
        for node in root.iter():
            assert node.tag.rsplit('}', 1)[-1] not in BLOCKED
            for name, value in node.attrib.items():
                assert not name.startswith('on')
                if name.rsplit('}', 1)[-1] == 'href':
                    assert value.startswith('#') and value[1:] in ids
        assert not re.search(r'(?i)(data:|https?://(?!www.w3.org/)|\b(?:nan|infinity)\b)', svg)
        assert file.stat().st_size == item['bytes'] < 35000
        assert hashlib.sha256(file.read_bytes()).hexdigest() == item['sha256']
        item['xmlValid'] = True
        item['selfContained'] = True
        item['native2dOnly'] = True
    assert len({item['sha256'] for item in report}) == 3
    (ROOT / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('3 SVG autonomes, distincts, natifs 2D, sans bitmap ; XML et références internes valides.')


if __name__ == '__main__':
    verify()
