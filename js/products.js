// FSComerce Admin — Products list page (search, filters, status actions)
import { renderChrome, page, icons } from "./layout.js";
import { getDB, saveDB, fmtMoney, toast, confirmDialog } from "./store.js";

renderChrome("products", "Products");
const db = getDB();
const state = { q: "", status: "all" };

document.getElementById("page-content").innerHTML = page(
  "Products", `${db.products.length} products in your catalogue`,
  `<a class="btn btn-primary" href="product-detail.html">${icons.plus} New product</a>`,
  `
  <div class="toolbar">
    <div class="search">${icons.search}<input id="q" placeholder="Search products…"></div>
    <select class="filter" id="f-status">
      <option value="all">Status: All</option><option value="active">Active</option>
      <option value="draft">Draft</option><option value="archived">Archived</option>
    </select>
  </div>
  <div class="card"><div class="table-wrap">
    <table class="data">
      <thead><tr><th>Product</th><th>Status</th><th>Collection</th><th>Price</th><th>In stock</th><th>Sales</th><th></th></tr></thead>
      <tbody id="rows"></tbody>
    </table>
  </div></div>`
);

const SB = { active: "green", draft: "amber", archived: "gray" };

function render() {
  const list = db.products.filter(p =>
    (state.status === "all" || p.status === state.status) &&
    (!state.q || (p.title + p.handle + p.type).toLowerCase().includes(state.q.toLowerCase()))
  );
  const tb = document.getElementById("rows");
  if (!list.length) { tb.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="big">🏷️</div>No products found.</div></td></tr>`; return; }
  tb.innerHTML = list.map(p => {
    const col = db.collections.find(c => c.id === p.collection);
    return `
    <tr class="clickable" onclick="location.href='product-detail.html?id=${p.id}'">
      <td><div class="flex items-center gap-3"><div class="thumb">${p.thumbnail}</div>
        <div><div class="cell-title">${p.title}</div><div class="cell-sub mono">/${p.handle}</div></div></div></td>
      <td><span class="badge ${SB[p.status]}">${p.status}</span></td>
      <td>${col ? col.title : "—"}</td>
      <td>${fmtMoney(p.prices[0].amount)}</td>
      <td>${p.inventory > 10 ? p.inventory : `<span style="color:var(--red);font-weight:700">${p.inventory}</span>`}</td>
      <td>${p.sales}</td>
      <td class="right" onclick="event.stopPropagation()">
        <button class="btn btn-sm btn-ghost" data-dup="${p.id}" title="Duplicate">⧉</button>
        <button class="btn btn-sm btn-ghost" data-del="${p.id}" title="Delete" style="color:var(--red)">🗑</button>
      </td>
    </tr>`;
  }).join("");

  tb.querySelectorAll("[data-dup]").forEach(b => b.addEventListener("click", () => {
    const src = db.products.find(p => p.id === b.dataset.dup);
    const copy = JSON.parse(JSON.stringify(src));
    copy.id = "prd_" + Math.random().toString(36).slice(2, 7);
    copy.title = src.title + " (Copy)"; copy.handle = src.handle + "-copy"; copy.status = "draft"; copy.sales = 0;
    db.products.unshift(copy); saveDB(db); toast("Product duplicated"); render();
  }));
  tb.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", async () => {
    const p = db.products.find(x => x.id === b.dataset.del);
    if (!await confirmDialog("Delete product?", `"${p.title}" will be permanently removed. This cannot be undone.`, true)) return;
    db.products = db.products.filter(x => x.id !== p.id);
    db.collections.forEach(c => c.products = c.products.filter(idp => idp !== p.id));
    saveDB(db); toast("Product deleted", "warn"); render();
  }));
}
render();
document.getElementById("q").addEventListener("input", e => { state.q = e.target.value; render(); });
document.getElementById("f-status").addEventListener("change", e => { state.status = e.target.value; render(); });
