"""son_montage.py: the site's nature soundtrack (owner, 2026-10-27), cut from CC0 field recordings of Freesound.

    python decor/son_montage.py <raw folder>

The raw folder holds the HQ previews (https://cdn.freesound.org/previews/...-hq.ogg), saved as <name>.ogg with the names of
SOURCES below, or by their Freesound number (<number>.ogg); they are not in git. Writes decor/scene/son/:
vent.m4a and prairie.m4a (the two beds, looped by son.mjs with a crossfade), bourdons.m4a and oiseaux.m4a (sprites of short
calls: the bumblebees' passes, the blackbird's phrases and the skylark's song), son.json (each sprite's clips) and
SOURCES.md (the credits: none needed under CC0, given anyway).
"""
import json, os, subprocess, sys
import numpy as np
from scipy import signal

SOURCES = {
    'vent': (240914, 'bdvictor', 'Wheat in the Wind'),
    'prairie': (529670, 'bruno.auzet', 'french meadow on the ground.wav'),
    'bourdon-lavande': (397113, 'Kinoton', 'Bumblebee In Lavender'),
    'bourdon-passe1': (117145, 'cognito perceptu', 'buzzing bee 2 flyby.wav'),
    'bourdon-passe2': (859690, 'kvgarlic', 'Bee flyby LkMboro June 19 2026'),
    'merle': (188371, 'calodas', 'Blackbird_Sweden_long.wav'),
    'alouette': (387426, 'Kinoton', 'Single Skylark'),
}
SR = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scene', 'son')


def load(path, ch=2):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()


def highpass(x, hz):
    sos = signal.butter(4, hz, 'highpass', fs=SR, output='sos')
    return signal.sosfiltfilt(sos, x, axis=0).astype(np.float32)


def fade(x, a, b=None):
    b = a if b is None else b
    n, m = int(a * SR), int(b * SR)
    x = x.copy()
    if n: x[:n] *= (0.5 - 0.5 * np.cos(np.linspace(0, np.pi, n)))[:, None]
    if m: x[-m:] *= (0.5 + 0.5 * np.cos(np.linspace(0, np.pi, m)))[:, None]
    return x


def rms_db(x):
    return 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-12)


def level(x, target):
    """to an RMS of target dBFS (the clips are short: RMS over the clip, not an integrated loudness)"""
    return (x * 10 ** ((target - rms_db(x)) / 20)).astype(np.float32)


def events(x, band, lo, win=0.1, thr=-12, gap=0.6, min_len=1.2, max_len=6.0):
    """the stretches where the band's energy is within thr dB of its loudest tenth of a second, joined across gaps under
    gap s, kept when they last min_len..max_len s; returned as (start, end) in s with a margin"""
    sos = signal.butter(4, band, 'bandpass', fs=SR, output='sos')
    y = signal.sosfilt(sos, x.mean(1))
    w = int(win * SR)
    k = len(y) // w
    e = 10 * np.log10((y[:k * w].reshape(k, w) ** 2).mean(1) + 1e-12)
    on = e > np.percentile(e, 98) + thr
    segs, s = [], None
    for i, v in enumerate(on):
        if v and s is None: s = i
        if not v and s is not None:
            segs.append([s, i]); s = None
    if s is not None: segs.append([s, k])
    joined = []
    for a, b in segs:
        if joined and (a - joined[-1][1]) * win < gap: joined[-1][1] = b
        else: joined.append([a, b])
    out = []
    for a, b in joined:
        t0, t1 = max(0, a * win - 0.25), min(len(y) / SR, b * win + 0.35)
        if min_len <= t1 - t0 <= max_len and t0 >= lo[0] and t1 <= lo[1]: out.append((round(t0, 2), round(t1, 2)))
    return out


def write(name, x, kbps):
    tmp = os.path.join(OUT, name + '.f32')
    x.astype(np.float32).tofile(tmp)
    dst = os.path.join(OUT, name + '.m4a')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', tmp,
                    '-c:a', 'aac', '-b:a', f'{kbps}k', '-movflags', '+faststart', dst], check=True)
    os.remove(tmp)
    return os.path.getsize(dst)


def sprite(name, clips, kbps):
    """clips: [(id, x)] laid end to end with 0.4 s of silence between; returns the clips' places (s)"""
    pad = np.zeros((int(0.4 * SR), 2), np.float32)
    parts, places, t = [], [], 0.0
    for cid, x in clips:
        parts += [x, pad]
        places.append({'id': cid, 'debut': round(t, 3), 'duree': round(len(x) / SR, 3)})
        t += (len(x) + len(pad)) / SR
    size = write(name, np.concatenate(parts), kbps)
    return places, size


def main(raw):
    os.makedirs(OUT, exist_ok=True)
    src = lambda n: next(p for p in (os.path.join(raw, f'{n}.ogg'), os.path.join(raw, f'{SOURCES[n][0]}.ogg')) if os.path.isfile(p))
    sizes, meta = {}, {}

    # the beds: 90 s each, levelled, their ends faded for son.mjs's crossfade (3 s)
    vent = highpass(load(src('vent'))[int(4 * SR):int(94 * SR)], 70)
    sizes['vent'] = write('vent', fade(level(vent, -24), 0.05), 96)
    prairie = highpass(load(src('prairie'))[int(5 * SR):int(95 * SR)], 90)
    sizes['prairie'] = write('prairie', fade(level(prairie, -24), 0.05), 96)

    # the bumblebees: the two recorded passes, and the lavender's bumblebee cut where it buzzes (mono, made stereo: son.mjs
    # pans it)
    bees = []
    for n, (t0, t1) in (('bourdon-passe1', (0, 3.5)), ('bourdon-passe2', (1.2, 6.4))):
        x = highpass(load(src(n))[int(t0 * SR):int(t1 * SR)], 110)
        bees.append((n, fade(level(x, -20), 0.15, 0.4)))
    lav = load(src('bourdon-lavande'))
    for i, (t0, t1) in enumerate(events(lav, [120, 600], (0, 47), thr=-10, gap=0.4, min_len=1.5, max_len=5)[:6]):
        x = highpass(lav[int(t0 * SR):int(t1 * SR)], 110)
        bees.append((f'bourdon-lavande-{i}', fade(level(x, -20), 0.3, 0.5)))
    meta['bourdons'], sizes['bourdons'] = sprite('bourdons', bees, 96)

    # the birds: the blackbird's phrases (from the stretches without the background's rise), the skylark's song in three
    # pieces of 9 s
    birds = []
    merle = load(src('merle'))
    for i, (t0, t1) in enumerate(events(merle, [1800, 6000], (0, 78), thr=-14, gap=0.5, min_len=1.5, max_len=5)[:8]):
        x = highpass(merle[int(t0 * SR):int(t1 * SR)], 400)
        birds.append((f'merle-{i}', fade(level(x, -22), 0.2, 0.4)))
    al = load(src('alouette'))
    for i, t0 in enumerate((2, 30, 50)):
        x = highpass(al[int(t0 * SR):int((t0 + 9) * SR)], 1200)
        birds.append((f'alouette-{i}', fade(level(x, -22), 1.0, 1.5)))
    meta['oiseaux'], sizes['oiseaux'] = sprite('oiseaux', birds, 80)

    json.dump({'lits': ['vent', 'prairie'], **meta}, open(os.path.join(OUT, 'son.json'), 'w', encoding='utf-8', newline='\n'),
              ensure_ascii=False, indent=1)
    lines = ['# Les sons du site', '',
             "Des prises de son réelles de [Freesound](https://freesound.org), toutes sous licence CC0 (domaine public) :",
             "aucune attribution n'est due, on les cite quand même. Montage : `python decor/son_montage.py <dossier>`.", '',
             '| Fichier | Prise | Auteur |', '|---|---|---|']
    use = {'vent': 'vent.m4a', 'prairie': 'prairie.m4a', 'bourdon-lavande': 'bourdons.m4a', 'bourdon-passe1': 'bourdons.m4a',
           'bourdon-passe2': 'bourdons.m4a', 'merle': 'oiseaux.m4a', 'alouette': 'oiseaux.m4a'}
    for n, (sid, who, title) in SOURCES.items():
        lines.append(f'| {use[n]} | [{title}](https://freesound.org/s/{sid}/) | {who} |')
    open(os.path.join(OUT, 'SOURCES.md'), 'w', encoding='utf-8', newline='\n').write('\n'.join(lines) + '\n')
    print({k: f'{v // 1024} Ko' for k, v in sizes.items()})
    print({k: len(v) for k, v in meta.items()})


if __name__ == '__main__':
    main(sys.argv[1])
