// FSComerce Admin — Store Editor (live storefront customizer, Shopify-style)
import { renderChrome } from "./layout.js";
import { getDB, saveDB, toast } from "./store.js";

renderChrome("editor", "Store Editor");
const db = getDB();
if (!db.design) {
  db.design = {
    theme: null,
    announcement: "Free shipping on orders over Rs. 5,000 🚚",
    heroTitle: db.store.name,
    heroSub: "New season. New drop.",
    primary: "#4f46e5",
    accent: "#16a34a",
    font: "Inter",
    showAnnouncement: true,
    showSaleBadge: true,
    footerText: "Powered by FSComerce"
  };
}
const liveTheme = (db.themes || []).find(t => t.live);
if (!db.design.theme) db.design.theme = liveTheme ? liveTheme.name : "Nexora";
saveDB(db);

// Preview override via ?theme=Name (from marketplace preview button)
const qTheme = new URLSearchParams(location.search).get("theme");

const SECTIONS = [
  { id: "announcement", name: "Announcement bar" },
  { id: "hero", name: "Header & hero" },
  { id: "colors", name: "Colors & branding" },
  { id: "products", name: "Product grid" },
  { id: "footer", name: "Footer" }
];

const pc = document.getElementById("page-content");
pc.innerHTML = `
<div class="page-head">
  <div><h1>Store Editor</h1><p class="sub">Live editor for theme <b id="cur-theme">${db.design.theme}</b> · changes save to Firebase instantly.</p></div>
  <div class="head-actions"><button class="btn" id="reset-btn">Reset</button><button class="btn btn-primary" id="save-btn">Save changes</button></div>
</div>
<div class="editor-wrap">
  <div>
    <div class="card sect-list" style="padding:8px">
      ${SECTIONS.map((s, i) => `<a class="nav-item ${i === 0 ? "active" : ""}" data-sect="${s.id}" href="#${s.id}">${s.name}</a>`).join("")}
    </div>
    <div class="card card-pad mt-4" id="sect-panel"></div>
  </div>
  <div class="preview-frame" id="preview"></div>
</div>`;

function panel(id) {
  const d = db.design;
  const P = {
    announcement: `
      <div class="card-title mb-3">Announcement bar</div>
      <label class="switch mb-3"><input type="checkbox" id="f-showAnn" ${d.showAnnouncement ? "checked" : ""}> Show announcement bar</label>
      <div class="field"><label>Message</label><input class="input" id="f-ann" value="${d.announcement.replace(/"/g, "&quot;")}"></div>`,
    hero: `
      <div class="card-title mb-3">Header & hero</div>
      <div class="field"><label>Store name</label><input class="input" id="f-name" value="${db.store.name}"></div>
      <div class="field mt-3"><label>Hero title</label><input class="input" id="f-hTitle" value="${d.heroTitle}"></div>
      <div class="field mt-3"><label>Hero subtitle</label><input class="input" id="f-hSub" value="${d.heroSub}"></div>
      <div class="field mt-3"><label>Heading font</label><select class="input" id="f-font">${["Inter", "Georgia", "Courier New"].map(f => `<option ${d.font === f ? "selected" : ""}>${f}</option>`).join("")}</select></div>`,
    colors: `
      <div class="card-title mb-3">Colors & branding</div>
      <div class="field"><label>Primary color</label><input type="color" class="input" id="f-primary" value="${d.primary}" style="height:42px;padding:4px"></div>
      <div class="field mt-3"><label>Accent color</label><input type="color" class="input" id="f-accent" value="${d.accent}" style="height:42px;padding:4px"></div>
      <label class="switch mt-3"><input type="checkbox" id="f-badge" ${d.showSaleBadge ? "checked" : ""}> Show sale badges on products</label>`,
    products: `
      <div class="card-title mb-3">Featured product grid</div>
      <p class="muted" style="font-size:13px;margin-bottom:12px">Shows the first 6 active products from your catalogue (${db.products.filter(p => p.status === "active").length} active).</p>
      <div class="field"><label>Grid columns</label><select class="input" id="f-cols"><option>3</option><option>4</option></select></div>`,
    footer: `
      <div class="card-title mb-3">Footer</div>
      <div class="field"><label>Footer text</label><input class="input" id="f-foot" value="${d.footerText}"></div>
      <div class="field mt-3"><label>Contact email</label><input class="input" id="f-email" value="${db.store.email}"></div>`
  }[id];
  document.getElementById("sect-panel").innerHTML = P;
  bindInputs();
}

function renderPreview() {
  const d = db.design;
  const tname = qTheme || d.theme;
  const th = (db.themes || []).find(x => x.name === tname);
  const heroBg = th ? `linear-gradient(135deg,${th.colors[0]},${th.colors[1]})` : `linear-gradient(135deg,${d.primary},${d.accent})`;
  const prods = db.products.filter(p => p.status === "active").slice(0, 6);
  document.getElementById("preview").innerHTML = `
    <div class="pv-bar">🔒 Preview · ${tname} theme · fscomerce.store/${db.store.handle}</div>
    ${d.showAnnouncement ? `<div style="background:${d.primary};color:#fff;text-align:center;padding:8px;font-size:12px">${d.announcement}</div>` : ""}
    <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 22px;border-bottom:1px solid #eee;font-family:${d.font}">
      <b style="font-size:17px">${db.store.name}</b>
      <span style="font-size:13px;color:#555;display:flex;gap:18px"><span>Shop</span><span>Collections</span><span>About</span><span style="color:${d.primary};font-weight:700">Cart (0)</span></span>
    </div>
    <div class="pv-hero" style="background:${heroBg};font-family:${d.font}"><h2>${d.heroTitle}</h2><p>${d.heroSub}</p><span style="display:inline-block;margin-top:14px;background:#fff;color:#111;padding:9px 22px;border-radius:24px;font-size:13px;font-weight:700">Shop now</span></div>
    <div class="pv-grid">${prods.map(p => `
      <div class="pv-card" style="font-family:${d.font}">
        <div class="em">${p.thumbnail}</div>
        <div style="font-weight:600;font-size:13px;margin-top:6px">${p.title}</div>
        <div style="color:${d.primary};font-weight:700;font-size:13px;margin-top:3px">${p.currency || db.store.currency}. ${Number(p.prices[0].amount).toLocaleString()}</div>
        ${d.showSaleBadge ? `<span style="display:inline-block;background:${d.accent};color:#fff;font-size:10px;border-radius:10px;padding:2px 8px;margin-top:6px">SALE</span>` : ""}
      </div>`).join("")}</div>
    <div class="pv-foot"><span>${d.footerText}</span><span>${db.store.email}</span></div>`;
  document.getElementById("cur-theme").textContent = tname;
}

function collect() {
  const g = id => document.getElementById(id);
  if (g("f-ann")) db.design.announcement = g("f-ann").value;
  if (g("f-showAnn")) db.design.showAnnouncement = g("f-showAnn").checked;
  if (g("f-hTitle")) db.design.heroTitle = g("f-hTitle").value;
  if (g("f-hSub")) db.design.heroSub = g("f-hSub").value;
  if (g("f-font")) db.design.font = g("f-font").value;
  if (g("f-name")) db.store.name = g("f-name").value || db.store.name;
  if (g("f-primary")) db.design.primary = g("f-primary").value;
  if (g("f-accent")) db.design.accent = g("f-accent").value;
  if (g("f-badge")) db.design.showSaleBadge = g("f-badge").checked;
  if (g("f-foot")) db.design.footerText = g("f-foot").value;
  if (g("f-email")) db.store.email = g("f-email").value || db.store.email;
  renderPreview();
}

function bindInputs() {
  document.querySelectorAll("#sect-panel input, #sect-panel select").forEach(el => {
    el.addEventListener("input", collect);
    el.addEventListener("change", collect);
  });
}

document.querySelectorAll("[data-sect]").forEach(a => a.onclick = (e) => {
  e.preventDefault();
  document.querySelectorAll(".sect-list .nav-item").forEach(x => x.classList.remove("active"));
  a.classList.add("active");
  panel(a.dataset.sect);
});

document.getElementById("save-btn").onclick = () => {
  if (qTheme) db.design.theme = qTheme;
  saveDB(db); // localStorage + Firebase (via boot.js hook)
  toast("Design saved to Firebase ✓");
};
document.getElementById("reset-btn").onclick = () => {
  delete db.design; saveDB(db); location.href = "editor.html";
};

panel("announcement");
renderPreview();
