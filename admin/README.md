# FSComerce Admin Panel

The FSComerce operations dashboard — a polished, dependency-free eCommerce admin workspace
built with **HTML5, inline CSS and vanilla JavaScript**. Visual identity: green-and-white
commerce-operations design system with light/dark themes.

## Run locally

```bash
cd admin
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173` (or `/admin/` when serving the repository root).

## Architecture

- `index.html` contains the application shell and the embedded design system (`<style>` block).
- `assets/app.js` is the only code file: routing/rendering per page, mock data, modals,
  drawers, search, filters, command palette (⌘/Ctrl + K), CSV export, toasts, dark-mode
  persistence (localStorage) and navigation.
- Each module screen is its own static HTML page under a folder (`products/index.html`,
  `orders/index.html`, ...) so links work on any static host (Vercel, Netlify, GitHub Pages).
- No React/Vue/Angular, no build step, no backend required. All links are relative paths.

## Included modules

Overview/Home, Products (+ create/edit/details/variants/options/tags), Categories,
Collections, Price Lists, Orders (+ details/drafts/returns/exchanges/create), Customers
(+ groups/companies/segments), Inventory (+ locations/adjustments/transfers), Marketing
(campaigns/promotions/discounts/gift cards), Commerce (sales channels/regions/markets/
shipping/fulfillment/payments/transactions), Analytics (overview/sales/products/customers/
traffic/conversion/reports), Content (pages/navigation/media/metaobjects), Online Store
(storefront/themes/theme editor/domains/navigation), Developers (API keys/webhooks/
integrations/events/logs), Settings (notifications/activity/audit log/profile/store...).

## Future theme architecture (FSComerce SaaS)

ADMIN PANEL → STORE → THEME → STOREFRONT → CUSTOMER

The panel is intentionally store-agnostic: it manages store name, branding, colors, fonts,
products, categories, collections, navigation, homepage sections, banners, announcement bar,
footer, social links and theme selection through generic data structures in `assets/app.js`
(mock layer). Multiple storefront themes (Cravey — food, Arvena — furniture,
Nexora — electronics, Vérona — fashion) can consume the same underlying
store/product/order/customer data once the backend is connected.

## Environment variables

None required for the static demo. When wiring a real API, define them in `.env` at the
repository root (see `.env.example`): `VITE_API_URL`, Firebase web config keys, etc.
