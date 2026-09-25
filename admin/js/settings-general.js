// FSComerce Admin — General settings (preferences, store locale, danger zone with demo-data reset)
import { renderChrome, page } from "./layout.js";
import { resetDB, toast, confirmDialog } from "./store.js";

renderChrome("general", "General");

document.getElementById("page-content").innerHTML = page(
  "General", "Store-wide preferences", "",
  `
  <div class="card card-pad mb-4">
    <div class="card-title mb-4">Preferences</div>
    <div class="form-grid">
      <div class="field"><label>Storefront language</label><select class="input"><option>English</option><option>Urdu</option><option>Arabic</option></select></div>
      <div class="field"><label>Timezone</label><select class="input"><option>(GMT+5) Karachi</option><option>(GMT+0) London</option><option>(GMT-5) New York</option></select></div>
      <div class="field"><label>Date format</label><select class="input"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option></select></div>
      <div class="field"><label>Units</label><select class="input"><option>Metric</option><option>Imperial</option></select></div>
    </div>
    <div class="mt-4 right"><button class="btn btn-primary" id="g-save">Save preferences</button></div>
  </div>

  <div class="card card-pad mb-4">
    <div class="card-title mb-4">Notifications</div>
    ${[["New order placed",true],["Low stock alert",true],["Weekly sales digest",false],["Customer reviews",false]]
      .map(([n,on]) => `<div class="list-row"><span style="font-weight:500">${n}</span>
        <label class="switch"><input type="checkbox" ${on?"checked":""}><span class="slider"></span></label></div>`).join("")}
  </div>

  <div class="card card-pad" style="border-color:var(--red)">
    <div class="card-title mb-2" style="color:var(--red)">Danger zone</div>
    <div class="list-row"><div><b>Reset demo data</b><div class="cell-sub">Restore products, orders and customers to the original sample set</div></div>
      <button class="btn" id="reset-data" style="color:var(--red);border-color:var(--red)">Reset</button></div>
    <div class="list-row"><div><b>Delete store</b><div class="cell-sub">Permanently close this store workspace</div></div>
      <button class="btn btn-danger" id="del-store">Delete store</button></div>
  </div>`
);

document.getElementById("g-save").addEventListener("click", () => toast("Preferences saved"));
document.getElementById("reset-data").addEventListener("click", async () => {
  if (!await confirmDialog("Reset demo data?", "All local changes will be lost and replaced by the sample catalogue.", true)) return;
  resetDB(); toast("Demo data restored"); setTimeout(() => location.reload(), 600);
});
document.getElementById("del-store").addEventListener("click", async () => {
  if (!await confirmDialog("Delete this store?", "This is a demo action — nothing is actually deleted on our servers.", true)) return;
  toast("Store deletion is disabled in the demo", "warn");
});
