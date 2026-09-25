// FSComerce Admin — Orders list page
import { renderChrome, page, icons } from "./layout.js";
import { getDB, fmtMoney, fmtDate } from "./store.js";

renderChrome("orders", "Orders");
const db = getDB();

const state = { q: "", fulfillment: "all", payment: "all" };

const FBadge = (f) => ({
  fulfilled: "green", shipped: "blue", returned: "purple", not_fulfilled: "amber", canceled: "gray",
  captured: "green", awaiting: "amber", refunded: "purple", canceled_p: "gray", requires_action: "red"
}[f] || "gray");

document.getElementById("page-content").innerHTML = page(
  "Orders", `${db.orders.length} orders · ${fmtMoney(db.orders.reduce((s,o)=>s+o.total,0))} volume`,
  `<a class="btn btn-primary" href="#" id="complete-btn">${icons.plus} Complete edit</a>`,
  `
  <div class="toolbar">
    <div class="search">${icons.search}<input id="q" placeholder="Search by order ID or customer…"></div>
    <select class="filter" id="f-fulfillment">
      <option value="all">Fulfilment: All</option><option value="not_fulfilled">Not fulfilled</option>
      <option value="fulfilled">Fulfilled</option><option value="shipped">Shipped</option>
      <option value="returned">Returned</option><option value="canceled">Canceled</option>
    </select>
    <select class="filter" id="f-payment">
      <option value="all">Payment: All</option><option value="captured">Captured</option>
      <option value="awaiting">Awaiting</option><option value="refunded">Refunded</option><option value="canceled">Canceled</option>
    </select>
  </div>
  <div class="card"><div class="table-wrap">
    <table class="data">
      <thead><tr><th>Date</th><th>Order</th><th>Customer</th><th>Fulfilment</th><th>Payment</th><th class="right">Total</th></tr></thead>
      <tbody id="rows"></tbody>
    </table>
  </div></div>`
);

function render() {
  let list = db.orders.filter(o =>
    (state.fulfillment === "all" || o.fulfillment === state.fulfillment) &&
    (state.payment === "all" || o.payment === state.payment) &&
    (!state.q || (o.displayId + o.customerName + o.email).toLowerCase().includes(state.q.toLowerCase()))
  );
  const tb = document.getElementById("rows");
  if (!list.length) {
    tb.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="big">🔍</div>No orders match your filters.</div></td></tr>`;
    return;
  }
  tb.innerHTML = list.map(o => `
    <tr class="clickable" onclick="location.href='order-detail.html?id=${o.id}'">
      <td>${fmtDate(o.date)}</td>
      <td class="mono">#${o.id.split("_")[1]}</td>
      <td><div class="cell-title">${o.customerName}</div><div class="cell-sub">${o.email}</div></td>
      <td><span class="badge ${FBadge(o.fulfillment)}">${o.fulfillment.replace("_"," ")}</span></td>
      <td><span class="badge ${FBadge(o.payment)}">${o.payment}</span></td>
      <td class="right"><b>${fmtMoney(o.total)}</b></td>
    </tr>`).join("");
}
render();

document.getElementById("q").addEventListener("input", e => { state.q = e.target.value; render(); });
document.getElementById("f-fulfillment").addEventListener("change", e => { state.fulfillment = e.target.value; render(); });
document.getElementById("f-payment").addEventListener("change", e => { state.payment = e.target.value; render(); });
document.getElementById("complete-btn").addEventListener("click", e => {
  e.preventDefault();
  location.href = "order-detail.html?id=" + (db.orders.find(o => o.fulfillment === "not_fulfilled")?.id || db.orders[0].id);
});
