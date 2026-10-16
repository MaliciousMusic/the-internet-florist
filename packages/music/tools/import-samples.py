"""Build a compact, traceable sample bank from freely redistributable sources."""
import hashlib
import html
import io
import json
from pathlib import Path
import re
import sys
import urllib.request
import urllib.parse
import zipfile
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "out" / "audio-tools"))
import numpy as np
import soundfile as sf
import py7zr

REVISION = "440300901dfe9275fd84e0b7763af1f8443ae62e"
SFZ_REVISION = "6dd651d55dde97fd4028699be9d4481f26917891"
RATE = 24000
CACHE = ROOT / "out" / "sample-sources"
CACHE.mkdir(parents=True, exist_ok=True)
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)

def download(url):
    target = CACHE / (hashlib.sha256(url.encode()).hexdigest() + Path(url.split("?")[0]).suffix)
    if not target.exists():
        request = urllib.request.Request(url, headers={"User-Agent": "Belai-music-sample-import/0.3"})
        pending = target.with_suffix(target.suffix + ".part")
        with urllib.request.urlopen(request, timeout=60) as response, pending.open("wb") as output:
            while chunk := response.read(256 * 1024):
                output.write(chunk)
        pending.replace(target)
    return target.read_bytes()

def page_files(page, extensions):
    source = download(page).decode()
    links = list(dict.fromkeys(html.unescape(link) for link in re.findall(r'href="([^"]+)"', source)
        if "/sites/default/files/" in link and any(link.lower().split("?")[0].endswith(ext) for ext in extensions)))
    return ["https://opengameart.org" + link if link.startswith("/") else link for link in links]

PITCH_ROOTS = {}
VELOCITIES = {}
def midi(path):
    # VSCO filenames use different octave conventions; authoritative SFZ roots take precedence.
    return PITCH_ROOTS.get(path)

if (ROOT / "out" / "vsco-tree.json").exists():
    tree = json.loads((ROOT / "out" / "vsco-tree.json").read_text(encoding="utf-8-sig"))
else:
    tree = json.loads(download(f"https://api.github.com/repos/sgossner/VSCO-2-CE/git/trees/{REVISION}?recursive=1"))
paths = [entry["path"] for entry in tree["tree"] if entry["path"].endswith(".wav")]

# Each articulation is an actual recorded performance, with several root notes.
groups = {
    "piano": ("Keys/Upright Nr1/", r"_pp_|_mf_"),
    "harp": ("Strings/Harp/", "."),
    "flute": ("Woodwinds/Flute/susNV/", "v1"),
    "flute-vibrato": ("Woodwinds/Flute/susvib/", "v1"),
    "clarinet": ("Woodwinds/Clarinet/susLong/", "v1"),
    "clarinet-short": ("Woodwinds/Clarinet/stac/", "v1"),
    "oboe": ("Woodwinds/Oboe/Sus/", "v1"),
    "bassoon": ("Woodwinds/Bassoon/sus/", "v1"),
    "piccolo": ("Woodwinds/Piccolo/Stac/", "."),
    "cello": ("Strings/Cello Section/susvib/", "v1"),
    "cello-pizz": ("Strings/Cello Section/pizzT/", "v1"),
    "viola": ("Strings/Viola Section/susvib/", "v1"),
    "viola-pizz": ("Strings/Viola Section/pizz/", "v1"),
    "violin": ("Strings/Solo Violin/Arco Vib/", "_p"),
    "violin-pizz": ("Strings/Solo Violin/Pizz/", "_p"),
    "strings": ("Strings/Violin Section/susVib/", "v1"),
    "bass-pizz": ("Strings/Solo Contrabass/Pizz/", "v1"),
    "horn": ("Brass/F Horn/mute/", "v1"),
    "trombone": ("Brass/Tenor Trombone/sus/", "v1"),
    "trumpet": ("Brass/Trumpet/sus/", "v1"),
    "tuba": ("Brass/Tuba/sus/", "v1"),
    "marimba": ("Percussion/Marimba/", "."),
    "glockenspiel": ("Percussion/Glock/", "."),
    "xylophone": ("Percussion/Xylo/", "."),
    "flute-short": ("Woodwinds/Flute/stac/", "v1|v2"),
    "oboe-short": ("Woodwinds/Oboe/Stacc/", "v1|v2"),
    "bassoon-short": ("Woodwinds/Bassoon/stac/", "v1|v2"),
    "violin-spiccato": ("Strings/Solo Violin/spic/", "v1|v2"),
    "viola-spiccato": ("Strings/Viola Section/spic/", "v1|v2"),
    "cello-spiccato": ("Strings/Cello Section/spic/", "v1|v2"),
    "organ-recorded": ("Keys/Organ/Quiet/", "."),
    "trumpet-muted": ("Brass/Trumpet/harmonM-sus/", "v1|v2"),
}
mapping_files = dict(zip(groups, ["VSUpright1", "Harp", "FluteSusNV", "FluteSusVib", "ClarinetSus", "ClarinetStac",
    "OboeSusNV", "BassoonSus", "PiccoloStac", "CelloEnsSusVib", "CelloEnsPizz", "ViolaEnsSusVib", "ViolaEnsPizz",
    "SViolinVib", "SViolinPizz", "ViolinEnsSusVib", "ContrabassPizz", "FHornMute", "TromboneSus", "TrumpetSus",
    "TubaSus", "Marimba", "Glockenspiel", "Xylophone", "FluteStac", "OboeStac", "BassoonStac",
    "SViolinSpic", "ViolaEnsSpic", "CelloEnsSpic", "OrganQuiet", "TrumpetHarmonMuteSus"]))
mapping_sources = {}
for instrument, filename in mapping_files.items():
    url = f"https://raw.githubusercontent.com/sgossner/VSCO-2-CE/{SFZ_REVISION}/{filename}.sfz"
    raw = download(url)
    source = raw.decode("utf-8-sig")
    default = re.search(r"default_path=([^\r\n]+)", source)[1].replace("\\", "/")
    for region in re.split(r"<region>", source)[1:]:
        sample = re.search(r"sample=([^\r\n]+)", region)
        root = re.search(r"pitch_keycenter=(\d+)", region)
        if sample and root:
            path = default + sample[1].strip().replace("\\", "/")
            PITCH_ROOTS[path] = int(root[1])
            lo = re.search(r"lovel=(\d+)", region)
            hi = re.search(r"hivel=(\d+)", region)
            VELOCITIES[path] = (int(lo[1]) + int(hi[1])) / 254 if lo and hi else .5
    mapping_sources[instrument] = {"source": url, "sha256": hashlib.sha256(raw).hexdigest()}

samples = []
offset = 0
bank_path = CACHE / "library.pcm.tmp"
bank = bank_path.open("wb")

def append_sample(instrument, raw, filename, page, author, license_name, root, start=0, seconds=4.5):
    global offset
    signal, rate = sf.read(io.BytesIO(raw), dtype="float32", always_2d=True)
    signal = signal.mean(axis=1)
    first = int(start * rate)
    signal = signal[first:min(len(signal), first + int(seconds * rate))]
    if len(signal) < rate * .03:
        return
    signal -= signal.mean()
    # Remove high-frequency content before resampling; deterministic FFT-domain low pass.
    spectrum = np.fft.rfft(signal)
    spectrum[np.fft.rfftfreq(len(signal), 1 / rate) > min(9000, RATE * .42)] = 0
    signal = np.fft.irfft(spectrum, n=len(signal))
    length = max(2, round(len(signal) * RATE / rate))
    signal = np.interp(np.arange(length) * rate / RATE, np.arange(len(signal)), signal)
    peak = float(np.max(np.abs(signal)))
    if peak < 1e-5:
        return
    rms = float(np.sqrt(np.mean(signal * signal)))
    signal *= min(.8 / peak, .2 / max(rms, 1e-6))
    fade = min(round(RATE * (.008 if root is not None else .5)), length // 4)
    signal[:fade] *= np.linspace(0, 1, fade)
    signal[-fade:] *= np.linspace(1, 0, fade)
    pcm = np.round(np.clip(signal, -1, 1) * 32767).astype("<i2").tobytes()
    bank.write(pcm)
    samples.append({"id": f"{instrument}-{len([x for x in samples if x['instrument'] == instrument])}",
        "instrument": instrument, "root": root, "offset": offset, "frames": length, "rate": RATE,
        "file": filename, "source": page, "author": author, "license": license_name,
        "sourceSha256": hashlib.sha256(raw).hexdigest(), "sha256": hashlib.sha256(pcm).hexdigest(),
        "cutFrom": start, "seconds": length / RATE, "velocity": VELOCITIES.get(filename, .5)})
    offset += len(pcm)

def wait_for_memory():
    if sys.platform != "win32":
        return
    while True:
        raw = subprocess.check_output(["powershell.exe", "-NoProfile", "-Command",
            "(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory"], creationflags=0x08000000)
        if int(raw.strip()) * 1024 > 4 * 1024**3 + 64 * 1024**2:
            return
        print("En attente de mémoire pour préparer les échantillons.", flush=True)
        time.sleep(30)

for instrument, (prefix, pattern) in groups.items():
    wait_for_memory()
    candidates = [p for p in paths if p.startswith(prefix) and re.search(pattern, p) and midi(p) is not None]
    if not candidates:
        raise RuntimeError(f"Missing source group {instrument}: {prefix}")
    chosen = []
    low, high = min(midi(p) for p in candidates), max(midi(p) for p in candidates)
    for target in np.linspace(max(low, 36), min(high, 84), 5) if high >= 36 and low <= 84 else np.linspace(low, high, 5):
        path = min(candidates, key=lambda p: (abs(midi(p) - target), p))
        if path not in chosen:
            chosen.append(path)
    # Keep distinct soft/medium attacks and round-robin performances at the selected roots.
    roots = {midi(path) for path in chosen}
    chosen = []
    for root in sorted(roots):
        choices = [p for p in candidates if midi(p) == root]
        dynamics = sorted({round(VELOCITIES.get(p, .5), 3) for p in choices})[:2]
        for dynamic in dynamics:
            chosen.extend(sorted(p for p in choices if round(VELOCITIES.get(p, .5), 3) == dynamic)[:2])
    for path in chosen:
        url = f"https://raw.githubusercontent.com/sgossner/VSCO-2-CE/{REVISION}/" + urllib.parse.quote(path, safe="/")
        append_sample(instrument, download(url), path, "https://github.com/sgossner/VSCO-2-CE",
            "Sam Gossner, Simon Dalzell / Versilian Studios", "CC0-1.0", midi(path))
    print(instrument, len(chosen), flush=True)

nature = [
    ("birds", "https://opengameart.org/content/ambient-bird-sounds", [".ogg"], "isaiah658", "CC0-1.0"),
    ("rain", "https://opengameart.org/content/rain-loopable", [".zip"], "Ylmir", "CC0-1.0"),
    ("waves", "https://opengameart.org/content/water-waves", [".flac"], "transitking / qubodup", "CC0-1.0"),
    ("droplets", "https://opengameart.org/content/object-dropping-into-water-0", [".ogg"], "angeloyazar", "CC0-1.0"),
    ("wind", "https://opengameart.org/content/wind1", [".wav"], "Luke.RUSTLTD (synthesized)", "CC0-1.0"),
    ("chimes", "https://opengameart.org/content/wind-chimes", [".zip"], "pmiller", "CC0-1.0"),
    ("nature", "https://opengameart.org/content/nature-sounds-pack", [".7z"], "Antoine Goumain / Antoinemax", "CC-BY-4.0"),
]
for instrument, page, extensions, author, license_name in nature:
    wait_for_memory()
    urls = page_files(page, extensions)
    if instrument in ["rain", "chimes"]:
        urls = [url for url in urls if ("mp3" if instrument == "rain" else "ogg") in urllib.parse.unquote(url).lower()]
    if instrument == "wind":
        urls = urls[:2]
    for url in urls:
        raw = download(url)
        files = []
        if url.endswith(".zip"):
            with zipfile.ZipFile(io.BytesIO(raw)) as archive:
                files = [(name, archive.read(name)) for name in archive.namelist() if name.lower().endswith((".wav", ".ogg", ".mp3"))]
        elif url.endswith(".7z"):
            target = CACHE / "nature-pack"
            if not target.exists():
                target.mkdir()
                with py7zr.SevenZipFile(io.BytesIO(raw)) as archive:
                    for name in archive.getnames():
                        if not (target / name).resolve().is_relative_to(target.resolve()):
                            raise RuntimeError("Archive member outside sample cache")
                    archive.extractall(target)
            files = [(str(path.relative_to(target)), path.read_bytes()) for path in target.rglob("*.wav")]
        else:
            files = [(urllib.parse.unquote(url.rsplit("/", 1)[-1]), raw)]
        for name, content in files:
            if instrument == "nature" and "footstep" in name.lower():
                continue
            # Keep neutral, restful ambiences; sudden thunderstorms are unsuitable here.
            if instrument == "nature" and re.search("storm|thunder", name, re.I):
                continue
            family = instrument
            if instrument == "nature":
                family = "leaves" if re.search("foliage|leaf|leaves", name, re.I) else "stream" if re.search("stream|brook", name, re.I) else "forest"
            data, rate = sf.read(io.BytesIO(content), always_2d=True)
            duration = len(data) / rate
            for start in dict.fromkeys([0, min(12, max(0, duration - 12)), min(24, max(0, duration - 12))] if instrument == "birds" else [0]):
                append_sample(family, content, name, page, author, license_name, None, start, min(12, duration))
    print(instrument, len([x for x in samples if x['source'] == page]), flush=True)

bank.close()
instrument_chunks = {}
with bank_path.open("rb") as source:
    for instrument in dict.fromkeys(sample["instrument"] for sample in samples):
        records = [sample for sample in samples if sample["instrument"] == instrument]
        size = sum(sample["frames"] * 2 for sample in records)
        source.seek(records[0]["offset"])
        payload = source.read(size)
        instrument_chunks[instrument] = {"bytes": size, "sha256": hashlib.sha256(payload).hexdigest()}
manifest = {"version": "belai-samples/2", "rate": RATE, "bytes": offset, "instruments": instrument_chunks,
    "sha256": hashlib.sha256(bank_path.read_bytes()).hexdigest(),
    "pitchMappings": mapping_sources, "samples": samples}
bank_path.replace(ASSETS / "library.pcm")
(ASSETS / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf8", newline="\n")
(ROOT / "src" / "sample-manifest.ts").write_text("// Generated by tools/import-samples.py; do not edit by hand.\nexport const SAMPLE_MANIFEST = "
    + json.dumps(manifest, ensure_ascii=False, separators=(",", ":")) + " as const;\n", encoding="utf8", newline="\n")
(ASSETS / "LICENSE-VSCO.txt").write_bytes(download(f"https://raw.githubusercontent.com/sgossner/VSCO-2-CE/{REVISION}/LICENSE"))
print(f"Ready: {len(samples)} samples, {offset / 1024 / 1024:.1f} MiB", flush=True)
