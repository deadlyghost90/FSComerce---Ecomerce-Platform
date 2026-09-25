// FSComerce Admin — Order detail page (Medusa-style: timeline, fulfilment, payment, refund)
import { renderChrome, icons } from "./layout.js";
import { getDB, saveDB, fmtMoney, fmtDate, toast, confirmDialog } from "./store.js";

renderChrome("orders", "Order detail");
const db = getDB();
const id = new URLSearchParams(location.search).get("id") || db.orders[0].id;
const order = db.orders.find(o => o.id === id) || db.orders[0];

const FB = (f) => ({ fulfilled:"green", shipped:"blue", returned:"purple", not_fulfilled:"amber", canceled:"gray",
  captured:"green", awaiting:"amber", refunded:"purple" }[f] || "gray");

const subtotal = order.sales.reduce((s, l) => s + l.price * l.qty, 0);
const shipping = Math.max(0, order.total - subtotal);

const steps = [
  { key: "placed", label: "Order placed", when: order.date },
  { key: "fulfilled", label: "Marked as fulfilled", when: ["fulfilled","shipped","returned"].includes(order.fulfillment) ? order.date : null },
  { key: "shipped", label: "Shipped to customer", when: ["shipped","returned"].includes(order.fulfillment) ? order.date : null }
];

document.getElementById("page-content").innerHTML = `
  <div class="breadcrumb mb-4"><a href="orders.html">Orders</a><span class="sep">/</span><span class="current">${order.displayId}</span></div>
  <div class="page-head">
    <div><h1>${fmtMoney(order.total)}</h1><p class="sub">${order.displayId} · placed ${fmtDate(order.date)} · ${order.customerName}</p></div>
    <div class="head-actions">
      <button class="btn" id="btn-cancel">Cancel order</button>
      <button class="btn btn-primary" id="btn-fulfill" ${["fulfilled","shipped","returned","canceled"].includes(order.fulfillment) ? "disabled" : ""}>${icons.boxes} Complete fulfilment</button>
    </div>
  </div>

  <div class="grid" style="grid-template-columns:2fr 1fr;">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card card-pad">
        <div class="flex between items-center mb-4">
          <div class="card-title">Items</div>
          <span class="badge ${FB(order.fulfillment)}">${order.fulfillment.replace("_"," ")}</span>
        </div>
        <table class="data">
          <thead><tr><th>Product</th><th>Qty</th><th>Unit price</th><th class="right">Total</th></tr></thead>
          <tbody>
            ${order.sales.map(l => `<tr>
              <td><div class="flex items-center gap-3"><div class="thumb">📦</div><div><div class="cell-title">${l.title}</div><div class="cell-sub mono">Line item</div></div></div></td>
              <td>${l.qty}</td><td>${fmtMoney(l.price)}</td><td class="right"><b>${fmtMoney(l.price * l.qty)}</b></td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>

      <div class="card card-pad">
        <div class="card-title mb-4">Payment</div>
        <div class="kv"><span class="k">Payment status</span><span class="v"><span class="badge ${FB(order.payment)}">${order.payment}</span></span></div>
        <div class="kv"><span class="k">Subtotal</span><span class="v">${fmtMoney(subtotal)}</span></div>
        <div class="kv"><span class="k">Shipping</span><span class="v">${fmtMoney(shipping)}</span></div>
        ${order.refunds.map(r => `<div class="kv"><span class="k">Refunded (${r.reason})</span><span class="v" style="color:var(--red)">-${fmtMoney(r.amount)}</span></div>`).join("")}
        <div class="kv"><span class="k"><b>Total</b></span><span class="v"><b>${fmtMoney(order.total)}</b></span></div>
        <div class="mt-4 flex gap-2">
          <button class="btn btn-sm" id="btn-refund" ${order.payment !== "captured" ? "disabled" : ""}>Capture payment</button>
          <button class="btn btn-sm" id="btn-refund2" ${order.payment !== "captured" ? "disabled" : ""}>Refund amount</button>
        </div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card card-pad">
        <div class="card-title mb-4">Timeline</div>
        ${steps.map(s => `
          <div class="list-row">
            <div class="flex items-center gap-2">
              <span style="width:9px;height:9px;border-radius:99px;background:${s.when ? "var(--green)" : "var(--border)"}"></span>
              <div><div style="font-weight:600">${s.label}</div><div class="cell-sub">${s.when ? fmtDate(s.when) : "Pending"}</div></div>
            </div>
          </div>`).join("")}
      </div>
      <div class="card card-pad">
        <div class="card-title mb-4">Customer</div>
        <div class="flex items-center gap-3">
          <div class="avatar">${order.customerName.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
          <div><div style="font-weight:600">${order.customerName}</div><div class="cell-sub">${order.email}</div></div>
        </div>
        <div class="mt-4"><a class="btn btn-sm" href="customer-detail-fallback" onclick="location.href='customers.html'">View profile →</a></div>
      </div>
      <div class="card card-pad">
        <div class="card-title mb-4">Shipping address</div>
        <p class="muted" style="font-size:13px;line-height:1.7">House #12, Street 4<br>Gulberg III<br>Lahore, Punjab 54000<br>Pakistan</p>
      </div>
    </div>
  </div>`;

document.getElementById("btn-fulfill").addEventListener("click", async () => {
  if (!await confirmDialog("Complete fulfilment?", `All items in ${order.displayId} will be marked as fulfilled and the customer will be notified.`)) return;
  order.fulfillment = "fulfilled";
  saveDB(db);
  toast(`${order.displayId} marked as fulfilled`);
  setTimeout(() => location.reload(), 700);
});

document.getElementById("btn-cancel").addEventListener("click", async () => {
  if (!await confirmDialog("Cancel this order?", `${order.displayId} will be canceled and any captured payment released. This cannot be undone.`, true)) return;
  order.fulfillment = "canceled"; order.payment = "canceled";
  saveDB(db);
  toast(`${order.displayId} canceled`, "warn");
  setTimeout(() => location.reload(), 700);
});

document.getElementById("btn-refund").addEventListener("click", () => {
  if (order.payment === "awaiting") { order.payment = "captured"; saveDB(db); toast("Payment captured"); setTimeout(()=>location.reload(),600); }
  else toast("Payment already captured", "warn");
});

document.getElementById("btn-refund2").addEventListener("click", async () => {
  const amt = prompt("Amount to refund:", String(order.total));
  const n = Number(amt);
  if (!amt || isNaN(n) || n <= 0 || n > order.total) { toast("Invalid refund amount", "error"); return; }
  if (!await confirmDialog("Refund payment?", `A refund of ${fmtMoney(n)} will be issued to ${order.customerName}.`)) return;
  order.refunds.push({ amount: n, reason: "Admin refund", date: new Date().toISOString() });
  order.payment = n === order.total ? "refunded" : order.payment;
  saveDB(db);
  toast("Refund processed");
  setTimeout(() => location.reload(), 700);
});
