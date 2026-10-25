"""ramlive.py: the PC's free RAM and CPU, live, for every tool that throttles (owner, 2026-10-25: « un module qui track la RAM libre pour
qu'il puisse sourcer en live l'info et throttle optimalement » ; the floor is 4 GB, for good).

  python fleur/res/ramlive.py [--every 2]        one instance (fleur/res/ramlive.pid), runs until fleur/res/ramlive.stop exists

Every --every seconds it writes, each in one rename:
  fleur/res/ram.txt    one line read by shell builtins:  <epoch> <free GB> <cpu %> <lowest free GB over 60 s> <floor GB>
  fleur/res/ram.json   the same, plus the last 60 s of samples (the live page and the runner read it)
The floor (SEUIL, 4 GB) is the one threshold of the atelier: ws/gate.sh, fleur/res/ramwait.sh and the live runner start a heavy job or a
model call only above it. A reader treats a file older than 10 s as absent (the sampler stopped) and falls back to its own measure.
No process is spawned: RAM by GlobalMemoryStatusEx, CPU by GetSystemTimes, both through ctypes (the kernel token leak, 2026-10-24).
"""
import ctypes, json, os, sys, time, argparse

HERE = os.path.dirname(os.path.abspath(__file__))
SEUIL = 4.0  # GB of free RAM (owner, 2026-10-25: « 5,5 est exagéré, on peut descendre à 4 ; grave-le définitivement à 4 »)


class MEM(ctypes.Structure):
    _fields_ = [('l', ctypes.c_ulong), ('load', ctypes.c_ulong), ('tot', ctypes.c_ulonglong), ('avail', ctypes.c_ulonglong),
                ('tp', ctypes.c_ulonglong), ('ap', ctypes.c_ulonglong), ('tv', ctypes.c_ulonglong), ('av', ctypes.c_ulonglong), ('x', ctypes.c_ulonglong)]


class FT(ctypes.Structure):
    _fields_ = [('lo', ctypes.c_ulong), ('hi', ctypes.c_ulong)]


def free_gb():
    m = MEM()
    m.l = ctypes.sizeof(MEM)
    ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(m))
    return m.avail / 2 ** 30


def cpu_times():
    i, k, u = FT(), FT(), FT()
    ctypes.windll.kernel32.GetSystemTimes(ctypes.byref(i), ctypes.byref(k), ctypes.byref(u))
    v = lambda f: (f.hi << 32) | f.lo
    return v(i), v(k), v(u)  # kernel time includes idle time


def alive(pid):
    h = ctypes.windll.kernel32.OpenProcess(0x1000, False, int(pid))
    if not h:
        return False
    c = ctypes.c_ulong()
    ctypes.windll.kernel32.GetExitCodeProcess(h, ctypes.byref(c))
    ctypes.windll.kernel32.CloseHandle(h)
    return c.value == 259


def put(p, s):
    with open(p + '.tmp', 'w', encoding='ascii', newline='\n') as f:
        f.write(s)
    os.replace(p + '.tmp', p)


def read(max_age=10):
    """for Python readers: {'quand', 'libre', 'cpu', 'min60', 'seuil'} or None when the sampler is stopped"""
    try:
        t, libre, cpu, mn, seuil = open(os.path.join(HERE, 'ram.txt'), encoding='ascii').read().split()[:5]
        if time.time() - int(t) > max_age:
            return None
        return dict(quand=int(t), libre=float(libre), cpu=float(cpu), min60=float(mn), seuil=float(seuil))
    except Exception:
        return None


def main():
    a = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    a.add_argument('--every', type=float, default=2)
    o = a.parse_args()
    pf, stop = os.path.join(HERE, 'ramlive.pid'), os.path.join(HERE, 'ramlive.stop')
    if os.path.exists(pf):
        try:
            if alive(open(pf).read().strip() or 0):
                print('ramlive tourne déjà')
                return
        except Exception:
            pass
    if os.path.exists(stop):
        os.remove(stop)
    open(pf, 'w').write(str(os.getpid()))
    hist, prev = [], cpu_times()
    try:
        while not os.path.exists(stop):
            time.sleep(o.every)
            cur = cpu_times()
            di, dk, du = (c - p for c, p in zip(cur, prev))
            prev = cur
            busy = 100.0 * (dk + du - di) / max(1, dk + du)
            now, free = int(time.time()), free_gb()
            hist = [h for h in hist if now - h[0] <= 60] + [(now, round(free, 2), round(busy))]
            mn = min(h[1] for h in hist)
            put(os.path.join(HERE, 'ram.txt'), '%d %.2f %.0f %.2f %.1f\n' % (now, free, busy, mn, SEUIL))
            put(os.path.join(HERE, 'ram.json'), json.dumps(dict(quand=now, libre=round(free, 2), cpu=round(busy), min60=mn, seuil=SEUIL, histo=hist)))
    finally:
        if os.path.exists(pf) and open(pf).read().strip() == str(os.getpid()):
            os.remove(pf)


if __name__ == '__main__':
    main()
