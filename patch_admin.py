#!/usr/bin/env python3
"""Make the extracted FS-Commerce admin panel work when opened on a website.

Fixes applied to every HTML page in extracted/medusa-admin:
1. Root-relative asset reference  src="/assets/app.js"  -> relative to the page depth.
2. Root-relative sidebar links    href="/orders/index.html" -> relative links that also
   work from a sub-directory deployment or directly from the filesystem.
3. Adds missing CSS for .page-tabs/.page-tab (used by app.js but never styled) and for
   the mobile drawer state .rail.open (JS toggled a class that had no rule).
4. app.js: mark the active sidebar link based on the current URL; fix absolute links
   generated at runtime ("/settings/x/index.html", "/orders/index.html") to relative ones.
5. README updated with correct run/deploy instructions.
"""
import os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'extracted', 'medusa-admin')
os.chdir(ROOT)

files = sorted(os.path.join(r, f) for r, d, fs in os.walk('.') for f in fs if f.endswith('.html'))
print('html files:', len(files))

# ---------------------------------------------------------------------------
# Build the canonical sidebar nav from index.html's existing (absolute) links,
# converting each href to a document-relative path parameterised by %UP%.
# ---------------------------------------------------------------------------
t0 = open('index.html').read()
m = re.search(r'(<div class="rail-group"><div class="rail-label">HOME.*?)(</aside>)', t0, re.S)
assert m, 'sidebar block not found in index.html'
nav_src = m.group(1)   # includes the rail-bottom section (Settings / Profile links)

def up_for(depth):
    return '' if depth == 0 else '../' * depth

# replace every absolute href with a %UP%-prefixed relative one
def repl_href(mm):
    target = mm.group(1)                      # e.g. "orders/index.html"
    if target == 'index.html':
        return 'href="%sindex.html"' % ('./' if False else '%UP%')
    return 'href="%UP%' + target + '"'

nav_tpl = re.sub(r'href="/([^"]+)"', repl_href, nav_src)
assert '/"' not in nav_tpl.replace('viewBox="0 0 24 24"', ''), 'leftover absolute href'
assert '<a class="rail-link" href="%UP%index.html">' in nav_tpl

CSS_APPEND = ('.page-tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin-bottom:14px}'
              '.page-tab{padding:9px 13px;font-size:12px;font-weight:600;color:#777;border-bottom:2px solid transparent;margin-bottom:-1px}'
              '.page-tab:hover{color:#333}.page-tab.active{color:#181818;border-bottom-color:var(--accent)}'
              '@media(max-width:700px){.rail.open{display:flex;width:min(280px,86vw);box-shadow:12px 0 35px #0003}}')

changed = 0
for p in files:
    rel = os.path.relpath(os.path.dirname(p), '.')
    depth = 0 if rel == '.' else rel.count(os.sep) + 1
    up = up_for(depth)
    t = open(p).read()
    orig = t

    # 1. script src -> relative
    t = t.replace('src="/assets/app.js"', 'src="%sassets/app.js"' % up)

    # 2. sidebar -> relative nav (whole rail content incl. rail-bottom)
    new_nav = nav_tpl.replace('%UP%', up if up else './')
    t, c = re.subn(r'<div class="rail-group"><div class="rail-label">HOME.*?(?=</aside>)',
                   lambda mm: new_nav, t, count=1, flags=re.S)
    assert c == 1, 'sidebar replace failed: ' + p

    # 3. extra CSS
    t, c = re.subn(r'\.main\.shift\{margin-left:68px\}</style>',
                   lambda mm: '.main.shift{margin-left:68px}' + CSS_APPEND + '</style>', t, count=1)
    assert c == 1, 'css inject failed: ' + p

    if t != orig:
        open(p, 'w').write(t)
        changed += 1
print('patched html files:', changed)

# ---------------------------------------------------------------------------
# 4. assets/app.js fixes
# ---------------------------------------------------------------------------
js = open('assets/app.js').read()

anchor = "if(db.theme==='dark')document.body.classList.add('dark');"
assert anchor in js
active_iife = ("\n(function(){let base=new URL('.',location.href).pathname;"
               "let cur=base.replace(/\\/index\\/$/,'/');"
               "$$('.rail-link').forEach(a=>{try{let t=new URL(a.getAttribute('href'),location.href).pathname;"
               "if(t===cur||(t==='/index.html'&&cur==='/')||t.replace(/\\/index\\.html$/,'/')===cur)a.classList.add('active')}catch(e){}})})();"
               "\n")
# note: when the browser serves /orders/ (dir), location.href ends with '/' and base is '/orders/' -> cur '/orders/'
# matches href '.../orders/index.html' -> pathname '/orders/index.html' -> replace suffix -> '/orders/'. Good.
# When served as /orders/index.html, base='/orders/', cur stays '/orders/' too. Good.
js = js.replace(anchor, anchor + active_iife)

old_settings_link = "<a class=\"list-row\" href=\"/settings/${x.toLowerCase().replaceAll(' ','-')}/index.html\">"
new_settings_link = "<a class=\"list-row\" href=\"../${x.toLowerCase().replaceAll(' ','-')}/index.html\">"
assert old_settings_link in js
js = js.replace(old_settings_link, new_settings_link)

old_orders_link = "<a class=\"muted\" href=\"/orders/index.html\">"
new_orders_link = "<a class=\"muted\" href=\"orders/index.html\">"
assert old_orders_link in js
js = js.replace(old_orders_link, new_orders_link)

open('assets/app.js', 'w').write(js)
print('app.js patched')

# ---------------------------------------------------------------------------
# 5. README
# ---------------------------------------------------------------------------
open('README.md', 'w').write('''# FS Commerce Admin

A polished, dependency-free eCommerce admin workspace built with **HTML5, inline CSS, and vanilla JavaScript**.

## Run locally

```bash
cd medusa-admin
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173`. You can also open `index.html` directly from the file system - all links and assets use relative paths, so no server is required.

## Deploying to a website

Copy the whole folder into your web root (e.g. `public/admin/`). Every internal link and the script tag are relative to the document, so the panel works from any sub-path without configuration. Static hosts that map `/products` to `/products/index.html` will work as-is; direct `.html` URLs always work.

## Architecture

- Each module screen is a real static page (`<section>/index.html`) sharing one embedded design system.
- `assets/app.js` renders each page's content area (metrics, tables, forms, modals, search, filters, command palette, toasts, theme persistence) and highlights the active sidebar item based on the current URL.
- No React, Vue, Angular, frontend framework, build step, or backend is required.
''')
print('README rewritten')
print('DONE')
