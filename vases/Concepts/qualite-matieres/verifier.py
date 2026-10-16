"""Validate original integrity, self-contained SVGs and the sixteen comparison entries."""
from pathlib import Path
import hashlib
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
CAT = ROOT.parent
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
validation = json.loads((CAT / 'VALIDATION-400.json').read_text(encoding='utf-8'))
comparison = json.loads((ROOT / 'comparaison.json').read_text(encoding='utf-8'))
expected = {c['id']:c for c in validation['approvedConcepts']}
report = {'originalsUnchanged':0, 'privatePhotosUnchanged':0, 'beforeCopiesExact':0, 'nativeFinishedSVGs':[], 'checks':[]}
for c in expected.values():
    assert sha(CAT / c['file']) == c['sha256'], c['id']
    report['originalsUnchanged']+=1
for photo in json.loads((CAT.parent / 'inventaire.json').read_text(encoding='utf-8')):
    assert sha(CAT.parent / photo['path'])==photo['sha256'], photo['id']
    report['privatePhotosUnchanged']+=1
assert len(comparison['samples'])==16
assert len({s['material'] for s in comparison['samples']})==16
assert [s['id'] for s in comparison['samples']]==[s['id'] for s in validation['nextPhase']['samples']]
for s in comparison['samples']:
    assert sha(ROOT/s['before'])==expected[s['id']]['sha256']==s['beforeSha256']
    report['beforeCopiesExact']+=1
    after=ROOT/s['after']
    assert sha(after)==s['afterSha256']
    assert sha(after)!=s['beforeSha256']
    source=after.read_text(encoding='utf-8')
    xml=ET.fromstring(source)
    assert xml.attrib['viewBox']=='0 0 300 400'
    ids=[node.attrib['id'] for node in xml.iter() if 'id' in node.attrib]
    assert len(ids)==len(set(ids)), s['id']
    assert set(re.findall(r'url\(#([^)]*)\)',source)).issubset(ids), s['id']
    assert set(xml.attrib['aria-labelledby'].split()).issubset(ids)
    assert not re.search(r'<!ENTITY|<!DOCTYPE|data:|https://|file:|@import',source)
    for node in xml.iter():
        assert node.tag.split('}')[-1] not in ['image','script','foreignObject','iframe','animate','set']
        for name,value in node.attrib.items():
            assert not name.lower().startswith('on')
            if name.endswith('href'):
                assert value.startswith('#') and value[1:] in ids
    report['nativeFinishedSVGs'].append({'id':s['id'],'bytes':after.stat().st_size,'paths':source.count('<path '),'sha256':sha(after)})
assert len(list((ROOT/'apres').glob('*.svg')))==16
assert len(list((ROOT/'avant').glob('*.svg')))==16
assert comparison['conceptsApproved']==400 and comparison['finishedExamplesApproved'] is False
if comparison['version'] in ['v6-matieres-douces-2d', 'v7-sans-petits-pieds']:
    revised={'C001','C159','C253','C003','C021','C042','C295','C084','C017'}
    for s in comparison['samples']:
        if s['id'] in revised:
            source=(ROOT/s['after']).read_text(encoding='utf-8')
            assert not re.search(r'feDiffuseLighting|feSpecularLighting|feDistantLight|surfaceScale|heightRound',source), s['id']
        elif comparison['version']=='v6-matieres-douces-2d':
            assert sha(ROOT/s['after'])==sha(ROOT/s['previous']), s['id']
    report['painted2DWithoutHeightMaps']=sorted(revised)
    if comparison['version']=='v7-sans-petits-pieds':
        from retirer_pieds import without_small_feet, LEG_IDS
        for s in comparison['samples']:
            assert (ROOT/s['after']).read_text(encoding='utf-8') == without_small_feet((ROOT/'iterations/v6/apres'/f'{s["id"]}.svg').read_text(encoding='utf-8'),s['id'])
        report['smallFeetRemovedFrom']=sorted(LEG_IDS)
        report['approvedSurfacesPreserved']=16
    else:
        report['previousSVGsPreservedExactly']=7
assert 'mask="url(#pierced)"' in (ROOT/'apres/C017.svg').read_text(encoding='utf-8')
report['checks']=['16 matières distinctes et numéros de la passation', 'XML, identifiants uniques, références internes et cadrage', 'Aucune image, dépendance extérieure, animation ou code incorporé', '400 originaux et 116 photographies inchangés', '16 avant à l’octet près', 'Ajours construits par masque vectoriel']
(ROOT/'verification-structure.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('16 SVG autonomes ; 16 avant exacts ; 400 originaux et 116 photos inchangés.')
