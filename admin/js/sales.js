// FSComerce Admin — Sales page (revenue per day, per product, payment breakdown)
import { renderChrome, page } from "./layout.js";
import { getDB, fmtMoney, fmtDate } from "./store.js";

renderChrome("sales", "Sales");
const db = getDB();
const paid = db.orders.filter(o => o.payment === "captured" || o.payment === "refunded");
const total = paid.reduce((s, o) => s + o.total, 0);

document.getElementById("page-content").innerHTML = page(
  "Sales", "Every sale across all channels", "",
  `
  <div class="grid grid-3 mb-4">
    <div class="card stat"><div class="s-label">Completed sales</div><div class="s-value">${fmtMoney(total)}</div></div>
    <div class="card stat"><div class="s-label">Transactions</div><div class="s-value">${paid.length}</div></div>
    <div class="card stat"><div class="s-label">Items sold</div><div class="s-value">${paid.reduce((s,o)=>s+o.sales.reduce((a,l)=>a+l.qty,0),0)}</div></div>
  </div>
  <div class="card">
    <div style="padding:16px 20px;border-bottom:1px solid var(--border)" class="card-title">Transaction log</div>
    <div class="table-wrap"><table class="data">
      <thead><tr><th>Date</th><th>Sale</th><th>Products</th><th>Payment</th><th class="right">Amount</th></tr></thead>
      <tbody>${db.orders.map(o => `
        <tr class="clickable" onclick="location.href='order-detail.html?id=${o.id}'">
          <td>${fmtDate(o.date)}</td>
          <td class="mono">#${o.id.split("_")[1]}</td>
          <td>${o.sales.filter(l=>l.title!=="Shipping").map(l=>`${l.qty}× ${l.title}`).join(", ")}</td>
          <td><span class="badge ${o.payment==="captured"?"green":o.payment==="refunded"?"purple":o.payment==="awaiting"?"amber":"gray"}">${o.payment}</span></td>
          <td class="right"><b>${fmtMoney(o.total)}</b></td>
        </tr>`).join("")}
      </tbody>
    </table></div>
  </div>`
);
