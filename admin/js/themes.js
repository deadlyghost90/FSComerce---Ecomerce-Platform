// FSComerce Admin — Theme Marketplace (Cravey, Arvena, Nexora, Vérona + more)
import { renderChrome, page } from "./layout.js";
import { getDB, saveDB, toast } from "./store.js";

renderChrome("themes", "Theme Marketplace");
const db = getDB();
if (!db.themes) {
  db.themes = [
    { id: "thv_cravey", name: "Cravey", category: "Food & Restaurant", price: "$59", rating: 4.9, reviews: 412, installed: false, live: false, colors: ["#ff6b35", "#2d2a26"], desc: "Warm, appetite-driven layouts for food, cafés and restaurants. Menu grids, table booking blocks, delivery banners." },
    { id: "thv_arvena", name: "Arvena", category: "Furniture & Home", price: "$79", rating: 4.8, reviews: 268, installed: false, live: false, colors: ["#c8a27a", "#f4efe8"], desc: "Spacious editorial theme for furniture and homeware. Large room-shots, material swatches, showroom sections." },
    { id: "thv_nexora", name: "Nexora", category: "Electronics & Digital", price: "$69", rating: 4.7, reviews: 531, installed: true, live: true, colors: ["#2563eb", "#0b1120"], desc: "High-contrast tech storefront with spec tables, comparison bars, mega-menus and launch countdowns." },
    { id: "thv_verona", name: "Vérona", category: "Fashion & Clothing", price: "$89", rating: 4.9, reviews: 897, installed: true, live: false, colors: ["#111", "#f6e7e1"], desc: "Editorial fashion theme. Lookbooks, size charts, model-first galleries, seasonal drop sections." },
    { id: "thv_aurora", name: "Aurora", category: "Beauty & Cosmetics", price: "$49", rating: 4.6, reviews: 154, installed: false, live: false, colors: ["#e879a9", "#fdf2f8"], desc: "Soft-gradient beauty storefront with shade finders and routine bundles." },
    { id: "thv_peak", name: "Peak", category: "Outdoor & Sports", price: "$55", rating: 4.5, reviews: 98, installed: false, live: false, colors: ["#166534", "#ecfdf5"], desc: "Rugged gear catalogue with activity filters and size/fit guides." }
  ];
  saveDB(db);
}

const cur = db.themes.find(t => t.live);
document.getElementById("page-content").innerHTML = page(
  "Theme Marketplace", `Live theme: <b>${cur ? cur.name : "None"}</b> · ${db.themes.filter(t => t.installed).length} installed on ${db.store.name}`, "",
  `
  <div class="grid grid-4 mb-4" style="grid-template-columns:repeat(3,1fr)">
    ${db.themes.map(t => `
      <div class="card" data-theme="${t.id}" style="overflow:hidden">
        <div style="height:120px;background:linear-gradient(135deg,${t.colors[0]},${t.colors[1]});display:flex;align-items:center;justify-content:center;color:#fff;font-size:26px;font-weight:800;letter-spacing:-.5px">${t.name}</div>
        <div class="card-pad">
          <div class="flex between items-center"><div class="card-title">${t.name}</div><span class="badge ${t.live ? "badge-green" : t.installed ? "badge-blue" : ""}">${t.live ? "Live" : t.installed ? "Installed" : t.price}</span></div>
          <div class="muted" style="font-size:12px;margin:4px 0">${t.category} · ★ ${t.rating} (${t.reviews})</div>
          <p style="font-size:13px;color:var(--text-2);line-height:1.5;min-height:56px">${t.desc}</p>
          <div class="flex gap-2 mt-3">
            ${t.installed
              ? (t.live ? `<button class="btn btn-sm" disabled>Currently live</button>` : `<button class="btn btn-sm btn-primary" data-publish="${t.id}">Publish</button>`)
              : `<button class="btn btn-sm btn-primary" data-install="${t.id}">Install ${t.price}</button>`}
            <button class="btn btn-sm" data-preview="${t.id}">Preview</button>
          </div>
        </div>
      </div>`).join("")}
  </div>
  <div class="card card-pad">
    <div class="card-title mb-2">How themes consume store data</div>
    <p class="muted" style="font-size:13px;line-height:1.6">Every FSComerce theme reads the same shared data model — products, collections, orders, customers, navigation and settings are stored in Firebase (<code>stores/&lt;id&gt;/adminData</code>). Installing or publishing a theme only changes presentation; your catalogue and customer data stay identical across Cravey, Arvena, Nexora, Vérona and any future theme.</p>
  </div>`);

document.querySelectorAll("[data-install]").forEach(b => b.onclick = () => {
  const t = db.themes.find(x => x.id === b.dataset.install);
  t.installed = true; saveDB(db); toast(`${t.name} installed`); location.reload();
});
document.querySelectorAll("[data-publish]").forEach(b => b.onclick = () => {
  const t = db.themes.find(x => x.id === b.dataset.publish);
  db.themes.forEach(x => x.live = false); t.live = true; saveDB(db); toast(`${t.name} is now live on your storefront`); setTimeout(() => location.reload(), 600);
});
document.querySelectorAll("[data-preview]").forEach(b => b.onclick = () => {
  const t = db.themes.find(x => x.id === b.dataset.preview);
  toast(`Opening ${t.name} preview…`);
  setTimeout(() => window.open("editor.html?theme=" + encodeURIComponent(t.name), "_blank"), 400);
});
