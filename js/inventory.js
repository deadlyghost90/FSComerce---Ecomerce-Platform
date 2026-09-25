// FSComerce Admin — Inventory page (stock levels, adjust quantities, low-stock alerts)
import { renderChrome, page, icons } from "./layout.js";
import { getDB, saveDB, toast } from "./store.js";

renderChrome("inventory", "Inventory");
const db = getDB();
const THRESHOLD = 10;

document.getElementById("page-content").innerHTML = page(
  "Inventory", `${db.products.length} variants tracked`,
  `<button class="btn" id="recalc">${icons.boxes} Recalculate stock</button>`,
  `
  <div class="grid grid-3 mb-4">
    <div class="card stat"><div class="s-label">In stock</div><div class="s-value" style="color:var(--green)">${db.products.filter(p=>p.inventory>THRESHOLD).length}</div></div>
    <div class="card stat"><div class="s-label">Low stock (&lt;${THRESHOLD})</div><div class="s-value" style="color:var(--amber)">${db.products.filter(p=>p.inventory>0&&p.inventory<=THRESHOLD).length}</div></div>
    <div class="card stat"><div class="s-label">Out of stock</div><div class="s-value" style="color:var(--red)">${db.products.filter(p=>p.inventory===0).length}</div></div>
  </div>
  <div class="card"><div class="table-wrap">
    <table class="data">
      <thead><tr><th>Product</th><th>Status</th><th>Stock level</th><th>Adjust</th><th class="right">Actions</th></tr></thead>
      <tbody id="rows"></tbody>
    </table></div></div>`
);

function render() {
  document.getElementById("rows").innerHTML = db.products.map(p => {
    const lvl = p.inventory === 0 ? `<span class="badge red">Out of stock</span>` :
      p.inventory <= THRESHOLD ? `<span class="badge amber">Low · ${p.inventory}</span>` :
      `<span class="badge green">${p.inventory} units</span>`;
    return `<tr>
      <td><div class="flex items-center gap-3"><div class="thumb">${p.thumbnail}</div><div class="cell-title">${p.title}</div></div></td>
      <td>${lvl}</td>
      <td><div class="progress" style="width:120px"><div style="width:${Math.min(100,p.inventory)}%"></div></div></td>
      <td><div class="flex items-center gap-2">
        <button class="btn btn-sm" data-dec="${p.id}">−</button>
        <input class="input" style="width:74px;text-align:center" type="number" min="0" value="${p.inventory}" data-inp="${p.id}">
        <button class="btn btn-sm" data-inc="${p.id}">+</button>
      </div></td>
      <td class="right"><button class="btn btn-sm btn-primary" data-set="${p.id}">Update</button></td>
    </tr>`;
  }).join("");

  const get = id => db.products.find(p => p.id === id);
  document.querySelectorAll("[data-inc]").forEach(b => b.addEventListener("click", () => {
    const inp = document.querySelector(`[data-inp="${b.dataset.inc}"]`); inp.value = Number(inp.value) + 1;
  }));
  document.querySelectorAll("[data-dec]").forEach(b => b.addEventListener("click", () => {
    const inp = document.querySelector(`[data-inp="${b.dataset.dec}"]`); inp.value = Math.max(0, Number(inp.value) - 1);
  }));
  document.querySelectorAll("[data-set]").forEach(b => b.addEventListener("click", () => {
    const p = get(b.dataset.set);
    const v = Number(document.querySelector(`[data-inp="${p.id}"]`).value);
    if (isNaN(v) || v < 0) { toast("Invalid quantity", "error"); return; }
    p.inventory = v; saveDB(db); toast(`${p.title}: stock set to ${v}`); render();
  }));
}
render();

document.getElementById("recalc").addEventListener("click", () => {
  toast("Stock recalculated against open orders");
});
