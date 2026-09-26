// FSComerce Admin — Regions page (sales channels / shipping regions, add country modal)
import { renderChrome, page, icons, modalShell, openModal, closeModal } from "./layout.js";
import { getDB, saveDB, uid, toast } from "./store.js";

renderChrome("regions", "Regions");
const db = getDB();

document.getElementById("page-content").innerHTML = page(
  "Regions", "Manage where you sell and in which currency",
  `<button class="btn btn-primary" id="new-reg">${icons.plus} Add region</button>`,
  `<div class="grid grid-2" id="cards"></div>`
) + modalShell("modal-reg", "Add region", `
  <div class="field mb-4"><label>Name *</label><input class="input" id="nr-name" placeholder="e.g. Europe"></div>
  <div class="field mb-4"><label>Currency</label><select class="input" id="nr-cur"><option>PKR</option><option>USD</option><option>EUR</option><option>GBP</option><option>AED</option></select></div>
  <div class="field"><label>Countries</label><input class="input" id="nr-countries" placeholder="Comma separated list"></div>
`, `<button class="btn" onclick="closeModalById('modal-reg')">Cancel</button><button class="btn btn-primary" id="nr-save">Save</button>`);

function render() {
  document.getElementById("cards").innerHTML = db.regions.map(r => `
    <div class="card card-pad">
      <div class="flex between items-center mb-4">
        <div class="flex items-center gap-2"><div class="thumb">🌍</div><div><div class="cell-title">${r.name}</div><div class="chip">${r.currency}</div></div></div>
        <button class="btn btn-sm btn-ghost" data-del="${r.id}" style="color:var(--red)">Delete</button>
      </div>
      <div class="cell-sub mb-2" style="font-weight:700;color:var(--text-2)">Countries</div>
      <div class="flex gap-2" style="flex-wrap:wrap">${r.countries.map(c=>`<span class="chip">${c}</span>`).join("")}</div>
      <div class="list-row mt-4"><span class="muted">Products priced for this region</span><b>${db.products.filter(p=>p.prices.some(x=>x.region===r.currency)).length}</b></div>
    </div>`).join("");
  document.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => {
    if (db.regions.length <= 1) { toast("At least one region is required", "error"); return; }
    db.regions = db.regions.filter(r => r.id !== b.dataset.del);
    saveDB(db); toast("Region deleted", "warn"); render();
  }));
}
render();

document.getElementById("new-reg").addEventListener("click", () => openModal("modal-reg"));
document.getElementById("nr-save").addEventListener("click", () => {
  const name = document.getElementById("nr-name").value.trim();
  if (!name) { toast("Name is required", "error"); return; }
  db.regions.push({ id: uid("reg"), name, currency: document.getElementById("nr-cur").value,
    countries: document.getElementById("nr-countries").value.split(",").map(s=>s.trim()).filter(Boolean) || [] });
  saveDB(db); toast("Region added"); closeModal("modal-reg"); render();
});
