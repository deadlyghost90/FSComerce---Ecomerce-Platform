# FSComerce — E-Commerce Platform

FSComerce is an eCommerce SaaS platform: a marketing site, Firebase-backed auth pages, a
theme-aware core editor (GrapesJS + Monaco), and a complete admin panel for store operations.

## Repository layout

| Path | Purpose |
|------|---------|
| `index.html` | Public landing page (links to Sign In / Sign Up / Admin Dashboard) |
| `signin.html`, `signup.html` | Authentication (Firebase Auth via `js/index.js`) |
| `dashboard.html` | Legacy FSComerce enterprise dashboard (Tailwind CDN + ApexCharts) |
| `pricing.html` | Plans page |
| `editstore.html` | Store theme editor shell (GrapesJS/Monaco assets vendored in `grapejs/`, `monacoeditor/`) |
| `css/style.css`, `js/index.js` | Landing/auth styles and Firebase logic |
| `admin/` | **FSComerce Admin Panel** (static, dependency-free) — see `admin/README.md` |
| `Fs-Comerce-admin.zip` | Original source archive of the admin panel (kept for provenance) |
| `saleor-dashboard/` | Vendored Saleor dashboard reference codebase (not part of deployment) |
| `vercel.json` | Vercel static-hosting configuration |

## Admin panel

The admin panel lives in `admin/`. It is a pure static HTML/CSS/JS application — no install,
no build step. Run it locally:

```bash
cd admin && python3 -m http.server 4173
```

Or serve the repository root and open `/admin/`.

## Deployment (Vercel)

Framework: **Static HTML** (no build). Build command: none; output directory: repository root.
`vercel.json` serves all HTML statically and adds trailing-slash rewrites so every admin
module URL (`/admin/products`, `/admin/orders/...`) resolves to its `index.html`.

Required environment variables: none for the static admin demo. Firebase web keys used by
`js/index.js` are public client keys; see `.env.example` for the variable names to use when
rotating projects or connecting a real API (`VITE_API_URL`).

## ARVENA storefront theme

The root `index.html` is now the ARVENA furniture storefront theme, with its bundled visuals in `assets/`. The previous FSComerce platform landing page is preserved at `platform.html`. The admin Theme Marketplace registers ARVENA as the live Furniture & Home theme and its Preview action opens the root storefront.
