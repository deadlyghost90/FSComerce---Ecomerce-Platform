# FS Commerce Admin

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
