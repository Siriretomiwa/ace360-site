#!/usr/bin/env python3
"""Build the ace360 preview pages and the installable theme zip.

  python3 tools/build.py            -> preview/index.html + work.html, dist/ace360-theme.zip
  python3 tools/build.py artifact X -> X and work.html next to it (self-contained pages using CDN builds)
"""
import os, re, subprocess, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
THEME = os.path.join(ROOT, 'ace360')

def render(page='front'):
    args = ['php', os.path.join(HERE, 'render-preview.php')] + (['work'] if page == 'work' else [])
    return subprocess.check_output(args, text=True)

def read(p):
    with open(os.path.join(THEME, p), encoding='utf-8') as f:
        return f.read()

LIBS = ['gsap.min.js', 'ScrollTrigger.min.js', 'lenis.min.js', 'three.min.js']
CDN = [
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
    'https://unpkg.com/lenis@1.1.13/dist/lenis.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js',
]

def local_preview(html, work=False):
    a = '../ace360/assets/'
    head = (f'<title>Ace 360 Services</title>\n'
            f'<link rel="stylesheet" href="{a}css/fonts.css">\n<link rel="stylesheet" href="{a}css/main.css">\n<meta name="description" content="Ace 360 Services: websites, online stores and maintenance for businesses in the Netherlands and abroad. See an estimate online, fixed launch date.">')
    libs = [l for l in LIBS if not (work and l == 'three.min.js')]
    scripts = ''.join(f'<script src="{a}vendor/{l}"></script>\n' for l in libs)
    if work:
        scripts += f'<script>window.ACE360_PREVIEW = true;</script>\n<script src="{a}js/screens.js"></script>\n<script src="{a}js/main.js"></script>'
    else:
        scripts += f'<script>window.ACE360_PREVIEW = true;</script>\n<script src="{a}js/demo.js"></script>\n<script src="{a}js/screens.js"></script>\n<script src="{a}js/film.js"></script>\n<script src="{a}js/main.js"></script>'
    return html.replace('<!--wp_head-->', head).replace('<!--wp_footer-->', scripts)

def artifact(html, work=False):
    body = re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1)
    head_script = re.search(r'<head>.*?(<script>.*?</script>)', html, re.S).group(1)
    body = body.replace('<!--wp_footer-->', '')
    out = ['<title>Ace 360 Services</title>',
           head_script,
           "<script>document.documentElement.classList.add('js');</script>",
           '<meta name="description" content="Ace 360 Services: websites, online stores and maintenance for businesses in the Netherlands and abroad. See an estimate online, fixed launch date.">',
           '<link rel="preconnect" href="https://fonts.googleapis.com">',
           '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
           '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital@1&family=Inter:wght@300..800&family=JetBrains+Mono:wght@400..700&display=swap">',
           '<style>\n' + read('assets/css/main.css') + '\n</style>',
           "<script>document.body.classList.add('home');</script>" if not work else '',
           body]
    out += [f'<script src="{u}"></script>' for u in CDN if not (work and 'three' in u)]
    out.append('<script>window.ACE360_PREVIEW = true;</script>')
    if not work:
        out.append('<script>\n' + read('assets/js/demo.js') + '\n</script>')
    # the artifact is one file: the product photos travel inline as data URIs
    import base64, json
    imgdir = os.path.join(THEME, 'assets', 'img', 'work')
    photos = {f[:-4]: 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(imgdir, f), 'rb').read()).decode()
              for f in sorted(os.listdir(imgdir)) if f.endswith('.jpg')}
    out.append('<script>window.ACE360_WORK_IMG = ' + json.dumps(photos) + ';</script>')
    out.append('<script>\n' + read('assets/js/screens.js') + '\n</script>')
    if not work:
        out.append('<script>\n' + read('assets/js/film.js') + '\n</script>')
    out.append('<script>\n' + read('assets/js/main.js') + '\n</script>')
    return '\n'.join(out)

def pages(html, out):
    """Static copy of the front page for GitHub Pages (or any static host)."""
    import shutil
    if os.path.isdir(out):
        shutil.rmtree(out)
    shutil.copytree(os.path.join(THEME, 'assets'), os.path.join(out, 'assets'))
    page = local_preview(html).replace('../ace360/assets/', 'assets/')
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(page)
    page = local_preview(render('work'), True).replace('../ace360/assets/', 'assets/')
    open(os.path.join(out, 'work.html'), 'w', encoding='utf-8').write(page)
    open(os.path.join(out, '.nojekyll'), 'w').close()

def make_zip(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        for dp, dn, fn in os.walk(THEME):
            dn.sort()
            for f in sorted(fn):
                if f.startswith('.'):
                    continue
                full = os.path.join(dp, f)
                z.write(full, os.path.relpath(full, ROOT))

if __name__ == '__main__':
    html = render()
    if len(sys.argv) > 2 and sys.argv[1] == 'pages':
        pages(html, sys.argv[2])
        sys.exit(0)
    if len(sys.argv) > 2 and sys.argv[1] == 'artifact':
        open(sys.argv[2], 'w', encoding='utf-8').write(artifact(html))
        open(os.path.join(os.path.dirname(os.path.abspath(sys.argv[2])), 'work.html'), 'w', encoding='utf-8').write(
            '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>\n'
            + artifact(render('work'), True).replace('<title>Ace 360 Services</title>', '<title>All work · Ace 360 Services</title>') + '\n</body></html>')
        sys.exit(0)
    os.makedirs(os.path.join(ROOT, 'preview'), exist_ok=True)
    open(os.path.join(ROOT, 'preview', 'index.html'), 'w', encoding='utf-8').write(local_preview(html))
    open(os.path.join(ROOT, 'preview', 'work.html'), 'w', encoding='utf-8').write(
        local_preview(render('work'), True).replace('<title>Ace 360 Services</title>', '<title>All work · Ace 360 Services</title>'))
    if '--no-zip' not in sys.argv:
        make_zip(os.path.join(ROOT, 'dist', 'ace360-theme.zip'))
    print('built')
