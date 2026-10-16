"""Remove the rejected three-leg stand without repainting approved surfaces."""
from pathlib import Path
import hashlib
import json
import re
import shutil

ROOT = Path(__file__).resolve().parent
LEG_IDS = {'C040', 'C089', 'C253', 'C043', 'C076', 'C007', 'C084', 'C017'}


def without_small_feet(source, cid):
    if cid not in LEG_IDS:
        return source
    anchors = [117, 150, 184] if cid == 'C017' else [150, 121, 181]
    for x in anchors:
        start = f'M{x-2} 347 C' if cid == 'C017' else (f'M{x-6} 341 L' if cid == 'C007' else f'M{x-5} 339 C')
        source, count = re.subn(r'<path\s+d="' + re.escape(start) + r'[^"\n]*"[^>]*?/?>', '', source)
        assert count == 1, (cid, x, count)
        if cid != 'C017':
            for start in [f'M{x-3} 342 Q'] + ([f'M{x-3} 347 Q'] if cid in {'C043', 'C084'} else []):
                source, count = re.subn(r'<path\s+d="' + re.escape(start) + r'[^"\n]*"[^>]*?/?>', '', source)
                assert count == 1, (cid, start, count)
    source, count = re.subn(r'<ellipse\s+[^>]*cy="365"[^>]*?/?>', '', source)
    assert count == 3, (cid, count)
    ground = '355' if cid == 'C017' else '350.8'
    source, count = re.subn(r'(<ellipse cx="155" cy=")[^"]+(" rx="5[12]" ry="4")', r'\g<1>'+ground+r'\2', source, count=1)
    assert count == 1, cid
    return source


if __name__ == '__main__':
    archive = ROOT / 'iterations/v6'
    if not archive.exists():
        shutil.copytree(ROOT / 'apres', archive / 'apres')
        for name in ['comparaison.json', 'affiner.py']:
            shutil.copy2(ROOT / name, archive / name)
    data = json.loads((archive / 'comparaison.json').read_text(encoding='utf-8'))
    data['version'] = 'v7-sans-petits-pieds'
    data['humanFeedback'] = 'Améliorations appréciées ; suppression demandée des petits pieds partout. Prochaine étape : 116 copies privées des références, avant les fusions.'
    for sample in data['samples']:
        cid = sample['id']
        source = (archive / 'apres' / f'{cid}.svg').read_text(encoding='utf-8')
        finished = without_small_feet(source, cid)
        (ROOT / sample['after']).write_text(finished, encoding='utf-8', newline='')
        sample['afterSha256'] = hashlib.sha256(finished.encode('utf-8')).hexdigest()
        sample['previous'] = f'iterations/v5/apres/{cid}.svg'
        sample['status'] = 'Améliorations appréciées par le porteur ; petits pieds retirés'
        sample['notes'] = sample['notes'].replace('et pieds en verre', 'et base continue en verre')
        if cid in LEG_IDS:
            sample['notes'] += ' Les trois petits pieds ont été supprimés ; la matière et le décor sont conservés.'
    (ROOT / 'comparaison.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    (ROOT / 'comparaison.js').write_text('window.VASE_STUDIES = '+json.dumps(data, ensure_ascii=False)+';\n', encoding='utf-8')
    print('Huit tripodes retirés ; les seize surfaces appréciées sont conservées.')
