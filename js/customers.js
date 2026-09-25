// FSComerce Admin — Customers page (list, search, detail drawer, orders per customer)
import { renderChrome, page, icons } from "./layout.js";
import { getDB, fmtMoney, fmtDate } from "./store.js";

renderChrome("customers", "Customers");
const db = getDB();
let q = "";

document.getElementById("page-content").innerHTML = page(
  "Customers", `${db.customers.length} customers`, "",
  `<div class="toolbar"><div class="search">${icons.search}<input id="q" placeholder="Search by name or email…"></div></div>
   <div class="card"><div class="table-wrap">
    <table class="data">
      <thead><tr><th>Customer</th><th>Email</th><th>Joined</th><th>Orders</th><th class="right">Spent</th></tr></thead>
      <tbody id="rows"></tbody>
    </table></div></div>`
);

function render() {
  const list = db.customers.filter(c => !q || (c.name + c.email).toLowerCase().includes(q.toLowerCase()));
  document.getElementById("rows").innerHTML = list.map(c => `
    <tr class="clickable" data-cid="${c.id}">
      <td><div class="flex items-center gap-3"><div class="avatar">${c.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
        <div class="cell-title">${c.name}</div></div></td>
      <td>${c.email}</td>
      <td>${fmtDate(c.joined).split(",")[0]}</td>
      <td>${c.orders}</td>
      <td class="right"><b>${fmtMoney(c.spent)}</b></td>
    </tr>`).join("") || `<tr><td colspan="5"><div class="empty-state">No customers found.</div></td></tr>`;
  document.querySelectorAll("[data-cid]").forEach(tr => tr.addEventListener("click", () => openDrawer(tr.dataset.cid)));
}
render();
document.getElementById("q").addEventListener("input", e => { q = e.target.value; render(); });

function openDrawer(cid) {
  const c = db.customers.find(x => x.id === cid);
  const orders = db.orders.filter(o => o.email === c.email);
  const old = document.getElementById("drawer"); if (old) old.remove();
  const d = document.createElement("div");
  d.id = "drawer";
  d.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,.5);z-index:95;display:flex;justify-content:flex-end;";
  d.innerHTML = `
    <div style="width:min(480px,100%);background:var(--surface);height:100%;overflow-y:auto;padding:26px;border-left:1px solid var(--border);animation:slideUp .2s">
      <div class="flex between items-center mb-4"><h2 style="font-size:18px">Customer profile</h2>
        <button class="icon-btn" id="dr-close">✕</button></div>
      <div class="flex items-center gap-3 mb-4"><div class="avatar" style="width:52px;height:52px;font-size:18px">${c.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
        <div><div style="font-weight:700;font-size:16px">${c.name}</div><div class="muted">${c.email} · ${c.phone}</div></div></div>
      <div class="grid grid-2 mb-4">
        <div class="card stat"><div class="s-label">Orders</div><div class="s-value">${c.orders}</div></div>
        <div class="card stat"><div class="s-label">Total spent</div><div class="s-value">${fmtMoney(c.spent)}</div></div>
      </div>
      <div class="card-title mb-2" style="margin-top:18px">Recent orders</div>
      ${orders.length ? orders.map(o => `
        <a href="order-detail.html?id=${o.id}" class="list-row" style="display:flex">
          <div><b>${o.displayId}</b><div class="cell-sub">${fmtDate(o.date)}</div></div>
          <b>${fmtMoney(o.total)}</b>
        </a>`).join("") : `<div class="muted">No orders from this customer yet.</div>`}
    </div>`;
  document.body.appendChild(d);
  d.addEventListener("click", e => { if (e.target === d || e.target.id === "dr-close") d.remove(); });
}
