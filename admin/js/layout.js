// FSComerce Admin — shared chrome (sidebar, topbar, theme, notifications)
import { guardAuth, logout, getDB } from "./store.js";

const I = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/></svg>',
  receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9z"/><circle cx="8" cy="8" r="1.4"/></svg>',
  boxes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
  collection: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.4"/><path d="M3.5 20c.6-3.5 2.8-5.5 5.5-5.5s4.9 2 5.5 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.7c2.4.2 4 1.9 4.5 4.6"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10v4a1 1 0 0 0 1 1h2l4 4V5L6 9H4a1 1 0 0 0-1 1z"/><path d="M14 8.5c2 .8 3 2.2 3 3.5s-1 2.7-3 3.5"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V6M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6M20 16V5"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5S14.5 18.2 12 20.5c-2.5-2.3-3.8-5.2-3.8-8.5S9.5 5.8 12 3.5z"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9l1.5-5h13L20 9"/><path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"/><path d="M5 11v9h14v-9"/><path d="M9 20v-5h5v5"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 13.5A8.5 8.5 0 1 1 10.5 4 6.8 6.8 0 0 0 20 13.5z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9.5a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.7-3.7"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 4h6v6M20 4 10 14"/><path d="M18 13v6a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H11"/></svg>'
};

export const icons = I;

const NAV = [
  { label: "Personalised", items: [
    { id: "dashboard", name: "Overview", href: "index.html", icon: "grid" },
    { id: "orders", name: "Orders", href: "orders.html", icon: "receipt" },
    { id: "products", name: "Products", href: "products.html", icon: "tag" },
    { id: "inventory", name: "Inventory", href: "inventory.html", icon: "boxes" },
    { id: "collections", name: "Collections", href: "collections.html", icon: "collection" },
    { id: "customers", name: "Customers", href: "customers.html", icon: "users" },
    { id: "promotions", name: "Promotions", href: "promotions.html", icon: "megaphone" }
  ]},
  { label: "Store", items: [
    { id: "analytics", name: "Analytics", href: "analytics.html", icon: "chart" },
    { id: "sales", name: "Sales", href: "sales.html", icon: "receipt" },
    { id: "regions", name: "Regions", href: "regions.html", icon: "globe" },
    { id: "themes", name: "Theme Marketplace", href: "themes.html", icon: "store" },
    { id: "editor", name: "Store Editor", href: "editor.html", icon: "gear" }
  ]},
  { label: "Settings", items: [
    { id: "store-settings", name: "Store", href: "settings-store.html", icon: "store" },
    { id: "team", name: "Team", href: "settings-team.html", icon: "users" },
    { id: "users", name: "Users", href: "settings-users.html", icon: "users" },
    { id: "api", name: "API keys", href: "settings-api.html", icon: "gear" },
    { id: "general", name: "General", href: "settings-general.html", icon: "gear" }
  ]}
];

export function renderChrome(activeId, crumbTitle) {
  // Theme init before paint
  if (localStorage.getItem("fs_theme") === "dark") document.documentElement.classList.add("dark");

  const db = getDB();
  const pending = db.orders.filter(o => o.fulfillment === "not_fulfilled" && o.payment !== "canceled").length;

  const navHtml = NAV.map(sec => `
    <div class="side-section">
      <div class="side-label">${sec.label}</div>
      ${sec.items.map(it => `
        <a class="nav-item ${it.id === activeId ? "active" : ""}" href="${it.href}">
          ${I[it.icon]}<span>${it.name}</span>
          ${it.id === "orders" && pending ? `<span class="count">${pending}</span>` : ""}
        </a>`).join("")}
    </div>`).join("");

  const shell = document.getElementById("app");
  shell.innerHTML = `
  <div class="layout">
    <aside class="sidebar">
      <div class="side-logo"><div class="logo-mark">FS</div><b>FSComerce</b></div>
      ${navHtml}
      <div class="side-footer">
        <div class="user-chip">
          <div class="avatar">MI</div>
          <div><div class="u-name">Mohsin Ilyas</div><div class="u-mail" id="user-email">owner@fscommerce.com</div></div>
          <button class="icon-btn" title="Sign out" onclick="window.__logout()" style="margin-left:auto;width:28px;height:28px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:15px;height:15px"><path d="M15 4h4a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 19 20h-4M10 8 6 12l4 4M6 12h10"/></svg>
          </button>
        </div>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <button class="icon-btn hamburger" onclick="document.body.classList.toggle('nav-open')">${I.menu}</button>
        <nav class="breadcrumb">
          <a href="index.html">Admin</a><span class="sep">/</span><span class="current">${crumbTitle || "Dashboard"}</span>
        </nav>
        <div class="topbar-actions">
          <button class="icon-btn" id="theme-toggle" title="Toggle theme"></button>
          <div style="position:relative">
            <button class="icon-btn" id="bell-btn" title="Notifications">${I.bell}<span class="dot"></span></button>
            <div class="notif-pop" id="notif-pop">
              <div style="font-weight:700;padding:8px 10px;font-size:13px">Notifications</div>
              <div class="notif-item"><span>🛒</span><div><b>New order ${db.orders[0]?.displayId || ""}</b><div class="muted">${pending} orders awaiting fulfilment</div></div></div>
              <div class="notif-item"><span>📦</span><div><b>Low stock alert</b><div class="muted">Shadow Cargo Pants — 8 left</div></div></div>
              <div class="notif-item"><span>💸</span><div><b>Payout processed</b><div class="muted">Rs. 84,200 sent to your bank</div></div></div>
            </div>
          </div>
          <a class="btn btn-sm" href="../index.html" target="_blank">${I.external} View site</a>
        </div>
      </header>
      <main class="content" id="page-content"></main>
    </div>
  </div>`;

  // Theme toggle wiring
  const tgl = document.getElementById("theme-toggle");
  const paintTheme = () => {
    const dark = document.documentElement.classList.contains("dark");
    tgl.innerHTML = dark ? I.sun : I.moon;
  };
  paintTheme();
  tgl.addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("fs_theme", dark ? "dark" : "light");
    paintTheme();
    window.dispatchEvent(new CustomEvent("fs-theme-change"));
  });

  // Notifications popover
  const bell = document.getElementById("bell-btn");
  const pop = document.getElementById("notif-pop");
  bell.addEventListener("click", (e) => { e.stopPropagation(); pop.classList.toggle("open"); });
  document.addEventListener("click", () => pop.classList.remove("open"));

  window.__logout = logout;
  guardAuth();
}

export function page(title, sub, actionsHtml, bodyHtml) {
  return `
    <div class="page-head">
      <div><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ""}</div>
      <div class="head-actions">${actionsHtml || ""}</div>
    </div>
    ${bodyHtml}`;
}

export function openModal(id) { document.getElementById(id).classList.add("open"); }
export function closeModal(id) { document.getElementById(id).classList.remove("open"); }
export function modalShell(id, title, bodyHtml, footHtml, large) {
  return `
  <div class="modal-overlay" id="${id}">
    <div class="modal ${large ? "lg" : ""}">
      <div class="modal-head"><h3>${title}</h3>
        <button class="icon-btn" onclick="closeModalById('${id}')">✕</button></div>
      <div class="modal-body">${bodyHtml}</div>
      ${footHtml ? `<div class="modal-foot">${footHtml}</div>` : ""}
    </div>
  </div>`;
}
window.closeModalById = (id) => closeModal(id);
// close on overlay click
document.addEventListener("click", (e) => {
  if (e.target.classList && e.target.classList.contains("modal-overlay")) e.target.classList.remove("open");
});
