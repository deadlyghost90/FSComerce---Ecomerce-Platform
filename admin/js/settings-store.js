// FSComerce Admin — Store settings (personalisation, payments placeholder, tax)
import { renderChrome, page } from "./layout.js";
import { getDB, saveDB, toast } from "./store.js";

renderChrome("store-settings", "Store settings");
const db = getDB();

document.getElementById("page-content").innerHTML = page(
  "Store", `Manage ${db.store.name}'s configuration`, "",
  `
  <div class="tabs" id="tabs">
    <button class="tab active" data-tab="details">Details</button>
    <button class="tab" data-tab="payments">Payments</button>
    <button class="tab" data-tab="tax">Tax</button>
  </div>

  <section data-pane="details">
    <div class="card card-pad">
      <div class="form-grid">
        <div class="field"><label>Store name</label><input class="input" id="s-name" value="${db.store.name}"></div>
        <div class="field"><label>Handle</label><input class="input mono" id="s-handle" value="${db.store.handle}"></div>
        <div class="field"><label>Contact email</label><input class="input" id="s-email" value="${db.store.email}"></div>
        <div class="field"><label>Default currency</label><select class="input" id="s-cur">${["PKR","USD","EUR","GBP"].map(c=>`<option ${c===db.store.currency?"selected":""}>${c}</option>`).join("")}</select></div>
        <div class="field full"><label>Category</label><input class="input" id="s-type" value="${db.store.type}"></div>
      </div>
      <div class="mt-4 right"><button class="btn btn-primary" id="s-save">Save changes</button></div>
    </div>
  </section>

  <section data-pane="payments" style="display:none">
    <div class="grid grid-2">
      ${[["Stripe","Card payments, Apple Pay & Google Pay.","green","Connected"],["PayPal","Checkout with PayPal balance.","green","Connected"],["JazzCash","Mobile wallets for Pakistan.","gray","Not configured"],["Bank transfer","Manual Easypaisa / bank deposits.","gray","Not configured"]]
        .map(([n,d,st,label]) => `
        <div class="card card-pad flex between items-center">
          <div><div class="flex items-center gap-2"><b>${n}</b><span class="badge ${st}">${label}</span></div>
          <div class="cell-sub mt-2">${d}</div></div>
          <button class="btn btn-sm" data-prov="${n}" ${st==="green"?"":"style='background:var(--accent);color:#fff;border-color:var(--accent)'"}>${st==="green"?"Manage":"Configure"}</button>
        </div>`).join("")}
    </div>
  </section>

  <section data-pane="tax" style="display:none">
    <div class="card card-pad">
      <div class="card-title mb-4">Tax settings</div>
      <label class="checkline mb-4"><span class="switch"><input type="checkbox" id="t-incl" checked><span class="slider"></span></span> Prices include tax</label>
      <div class="form-grid">
        <div class="field"><label>Default tax rate (%)</label><input class="input" type="number" id="t-rate" value="17" min="0" max="100"></div>
        <div class="field"><label>Tax jurisdiction</label><input class="input" value="Punjab, Pakistan"></div>
      </div>
      <div class="mt-4 right"><button class="btn btn-primary" id="t-save">Save tax settings</button></div>
    </div>
  </section>`
);

document.querySelectorAll("#tabs .tab").forEach(t => t.addEventListener("click", () => {
  document.querySelectorAll("#tabs .tab").forEach(x => x.classList.remove("active"));
  t.classList.add("active");
  document.querySelectorAll("[data-pane]").forEach(s => { s.style.display = s.dataset.pane === t.dataset.tab ? "" : "none"; });
}));

document.getElementById("s-save").addEventListener("click", () => {
  db.store.name = document.getElementById("s-name").value.trim() || db.store.name;
  db.store.handle = document.getElementById("s-handle").value.trim();
  db.store.email = document.getElementById("s-email").value.trim();
  db.store.currency = document.getElementById("s-cur").value;
  db.store.type = document.getElementById("s-type").value;
  saveDB(db); toast("Store details saved");
});
document.getElementById("t-save").addEventListener("click", () => toast("Tax settings saved"));
document.querySelectorAll("[data-prov]").forEach(b => b.addEventListener("click", () =>
  toast(`${b.dataset.prov}: provider setup would open here`, "warn")));
