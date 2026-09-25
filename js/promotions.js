// FSComerce Admin — Promotions page (create/edit promos, toggle status, copy code)
import { renderChrome, page, icons, modalShell, openModal, closeModal } from "./layout.js";
import { getDB, saveDB, uid, fmtDate, toast } from "./store.js";

renderChrome("promotions", "Promotions");
const db = getDB();

document.getElementById("page-content").innerHTML = page(
  "Promotions", `${db.promotions.filter(p=>p.status==="active").length} active campaigns`,
  `<button class="btn btn-primary" id="new-promo">${icons.plus} Create promotion</button>`,
  `<div class="card"><div class="table-wrap">
    <table class="data">
      <thead><tr><th>Promotion</th><th>Type</th><th>Discount</th><th>Status</th><th>Usage</th><th></th></tr></thead>
      <tbody id="rows"></tbody>
    </table></div></div>`
) + modalShell("modal-new-promo", "Create promotion", `
  <div class="form-grid">
    <div class="field"><label>Name *</label><input class="input" id="np-name" placeholder="e.g. Halloween Sale"></div>
    <div class="field"><label>Promo code *</label><input class="input mono" id="np-code" placeholder="GHOST25" style="text-transform:uppercase"></div>
    <div class="field"><label>Type</label><select class="input" id="np-type">
      <option value="discount">Percentage discount</option><option value="fixed">Fixed amount off</option><option value="free_shipping">Free shipping</option></select></div>
    <div class="field"><label>Value</label><input class="input" type="number" id="np-value" value="10" min="0"></div>
    <div class="field"><label>Starts at</label><input class="input" type="date" id="np-start"></div>
    <div class="field"><label>Ends at</label><input class="input" type="date" id="np-end"></div>
    <div class="field"><label>Usage limit</label><input class="input" type="number" id="np-limit" placeholder="Unlimited" min="1"></div>
  </div>
`, `<button class="btn" onclick="closeModalById('modal-new-promo')">Cancel</button><button class="btn btn-primary" id="np-save">Save</button>`);

const TB = { discount: "% off", fixed: "flat off", free_shipping: "free ship" };
const SB = { active: "green", scheduled: "blue", expired: "gray", draft: "amber" };

function render() {
  document.getElementById("rows").innerHTML = db.promotions.map(pr => `
    <tr>
      <td><div class="cell-title">${pr.code}</div><div class="cell-sub mono">promo_${pr.id.split("_")[1]}</div></td>
      <td>${TB[pr.type] || pr.type}</td>
      <td>${pr.type === "free_shipping" ? "—" : (pr.value + (pr.unit || ""))}</td>
      <td><span class="badge ${SB[pr.status]}">${pr.status}</span></td>
      <td>${pr.usage}${pr.limit ? " / " + pr.limit : ""}
        <div class="progress" style="width:90px;margin-top:4px"><div style="width:${pr.limit ? Math.min(100, pr.usage/pr.limit*100) : 100}%"></div></div></td>
      <td class="right">
        <button class="btn btn-sm" data-copy="${pr.code}">Copy code</button>
        <button class="btn btn-sm" data-toggle="${pr.id}">${pr.status === "active" ? "Pause" : "Activate"}</button>
      </td>
    </tr>`).join("");

  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", () => {
    navigator.clipboard?.writeText(b.dataset.copy);
    toast(`Code "${b.dataset.copy}" copied to clipboard`);
  }));
  document.querySelectorAll("[data-toggle]").forEach(b => b.addEventListener("click", () => {
    const pr = db.promotions.find(x => x.id === b.dataset.toggle);
    pr.status = pr.status === "active" ? "draft" : "active";
    saveDB(db); toast(`Promotion ${pr.status === "active" ? "activated" : "paused"}`); render();
  }));
}
render();

document.getElementById("new-promo").addEventListener("click", () => openModal("modal-new-promo"));
document.getElementById("np-save").addEventListener("click", () => {
  const code = document.getElementById("np-code").value.trim().toUpperCase();
  if (!code) { toast("Promo code is required", "error"); return; }
  if (db.promotions.some(p => p.code === code)) { toast("Code already exists", "error"); return; }
  const type = document.getElementById("np-type").value;
  db.promotions.unshift({
    id: uid("pro"), code, type,
    value: Number(document.getElementById("np-value").value) || 0,
    unit: type === "discount" ? "%" : "", scope: "order", status: "active",
    startsAt: document.getElementById("np-start").value || new Date().toISOString(),
    endsAt: document.getElementById("np-end").value || null,
    usage: 0, limit: Number(document.getElementById("np-limit").value) || null
  });
  saveDB(db); toast("Promotion created"); closeModal("modal-new-promo"); render();
});
