"""portwrap.py <script.py> [args...]: runs a shared atelier tool (fleur/fit.py...) unchanged, with every shell script it calls that has a private
copy next to it (fleur/shot.sh -> fleur/shot_p.sh, written by pipe.py with the server port of FLEUR_PORT) sent to that copy.
pipe.py copies this file into the working copy as fleur/portwrap_p.py; the shared tools are never modified."""
import os, re, sys, runpy, subprocess


def private(x):
    """a path to a shared .sh -> its private copy <name>_p.sh when it exists (relative paths: from the current directory)"""
    if not isinstance(x, str) or not x.endswith('.sh') or x.endswith('_p.sh'):
        return x
    p = x[:-3] + '_p.sh'
    return p if os.path.exists(p) else x


def remap(args):
    if isinstance(args, (list, tuple)):
        return type(args)(private(a) for a in args)
    if isinstance(args, str):  # a shell command line: each word that names a script
        return re.sub(r'[^\s"\']+\.sh\b', lambda m: private(m.group(0)), args)
    return args


_Popen = subprocess.Popen


class Popen(_Popen):
    def __init__(self, args, *a, **k):
        super().__init__(remap(args), *a, **k)


subprocess.Popen = Popen  # subprocess.run / call / check_output all go through it

if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    script = sys.argv[1]
    sys.argv = sys.argv[1:]
    sys.path.insert(0, os.path.dirname(os.path.abspath(script)))
    runpy.run_path(script, run_name='__main__')
