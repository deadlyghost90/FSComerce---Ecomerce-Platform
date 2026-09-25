// FSComerce Admin — Overview / Dashboard page
import { renderChrome, page, icons } from "./layout.js";
import { getDB, fmtMoney, timeAgo, guardAuth } from "./store.js";

renderChrome("dashboard", "Overview");
const db = getDB();

const orders = db.orders;
const revenue = orders.filter(o => o.payment === "captured").reduce((s, o) => s + o.total, 0);
const salesCount = orders.filter(o => o.payment !== "canceled").length;
const aov = salesCount ? Math.round(revenue / salesCount) : 0;
const visitors = 4820;
const convRate = ((salesCount / visitors) * 100).toFixed(2);

document.getElementById("page-content").innerHTML = page(
  `Welcome back, Mohsin 👋`,
  `Here's what's happening with ${db.store.name} today.`,
  `<a class="btn" href="orders.html">${icons.receipt} Orders</a>
   <a class="btn btn-primary" href="product-detail.html">${icons.plus} New product</a>`,
  `
  <div class="grid grid-4 mb-4">
    <div class="card stat"><div class="s-label">Total sales <span class="trend up">+12.4%</span></div><div class="s-value">${fmtMoney(revenue)}</div></div>
    <div class="card stat"><div class="s-label">Sales <span class="trend up">+8.1%</span></div><div class="s-value">${salesCount}</div></div>
    <div class="card stat"><div class="s-label">Average order value <span class="trend up">+4.0%</span></div><div class="s-value">${fmtMoney(aov)}</div></div>
    <div class="card stat"><div class="s-label">Conversion rate <span class="trend down">-0.3%</span></div><div class="s-value">${convRate}%</div></div>
  </div>

  <div class="grid" style="grid-template-columns: 2fr 1fr;">
    <div class="card card-pad">
      <div class="flex between items-center mb-4"><div><div class="card-title">Sales over time</div><div class="card-sub">Last 14 days</div></div>
        <select class="filter" id="chart-range"><option>14D</option><option>30D</option><option>90D</option></select>
      </div>
      <canvas id="salesChart" height="220"></canvas>
    </div>
    <div class="card card-pad">
      <div class="card-title mb-4">Getting started</div>
      <div id="setup-list"></div>
    </div>
  </div>

  <div class="grid grid-2 mt-6">
    <div class="card">
      <div class="flex between items-center" style="padding:16px 20px;border-bottom:1px solid var(--border)">
        <div class="card-title">Latest orders</div><a class="btn btn-sm btn-ghost" href="orders.html">View all →</a>
      </div>
      <div class="table-wrap"><table class="data"><tbody id="latest-orders"></tbody></table></div>
    </div>
    <div class="card">
      <div class="flex between items-center" style="padding:16px 20px;border-bottom:1px solid var(--border)">
        <div class="card-title">Top products</div><a class="btn btn-sm btn-ghost" href="products.html">View all →</a>
      </div>
      <div class="table-wrap"><table class="data"><tbody id="top-products"></tbody></table></div>
    </div>
  </div>
  `
);

// ---- Setup checklist ----
const setupItems = [
  { done: true, name: "Add your first product", href: "products.html" },
  { done: true, name: "Customize store details", href: "settings-store.html" },
  { done: false, name: "Set up payments", href: "settings-store.html" },
  { done: false, name: "Configure shipping options", href: "regions.html" },
  { done: true, name: "Invite team members", href: "settings-team.html" },
  { done: false, name: "Create your first promotion", href: "promotions.html" }
];
const sl = document.getElementById("setup-list");
const doneCount = setupItems.filter(i => i.done).length;
sl.innerHTML = `
  <div class="progress mb-4"><div style="width:${Math.round(doneCount / setupItems.length * 100)}%"></div></div>
  <div class="card-sub" style="margin-bottom:12px">${doneCount} of ${setupItems.length} steps completed</div>
  ${setupItems.map(i => `
    <a href="${i.href}" class="list-row" style="display:flex">
      <span style="font-weight:500;${i.done ? "color:var(--muted);text-decoration:line-through" : ""}">${i.name}</span>
      <span class="badge ${i.done ? "green" : "amber"}">${i.done ? "Done" : "To do"}</span>
    </a>`).join("")}`;

// ---- Latest orders ----
document.getElementById("latest-orders").innerHTML = orders.slice(0, 5).map(o => `
  <tr class="clickable" onclick="location.href='order-detail.html?id=${o.id}'">
    <td style="width:44px"><div class="thumb">🛒</div></td>
    <td><div class="cell-title">${o.displayId}</div><div class="cell-sub">${o.customerName}</div></td>
    <td class="right"><b>${fmtMoney(o.total)}</b><div class="cell-sub">${timeAgo(o.date)}</div></td>
  </tr>`).join("");

// ---- Top products ----
const top = [...db.products].sort((a, b) => b.sales - a.sales).slice(0, 5);
document.getElementById("top-products").innerHTML = top.map(p => `
  <tr class="clickable" onclick="location.href='product-detail.html?id=${p.id}'">
    <td style="width:44px"><div class="thumb">${p.thumbnail}</div></td>
    <td><div class="cell-title">${p.title}</div><div class="cell-sub">${fmtMoney(p.prices[0].amount)}</div></td>
    <td class="right"><b>${p.sales}</b><div class="cell-sub">units sold</div></td>
  </tr>`).join("");

// ---- Hand-rolled canvas area chart (no libraries) ----
function drawChart() {
  const c = document.getElementById("salesChart");
  if (!c) return;
  const dpr = window.devicePixelRatio || 1;
  const W = c.clientWidth = c.parentElement.clientWidth - 40;
  const H = 220;
  c.width = W * dpr; c.height = H * dpr;
  const ctx = c.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const dark = document.documentElement.classList.contains("dark");
  const data = [];
  for (let i = 0; i < 14; i++) data.push(30000 + Math.round(Math.abs(Math.sin(i * 1.7 + 2)) * 55000) + (i % 5) * 4000);
  const max = Math.max(...data) * 1.15;
  const padL = 46, padB = 26, padT = 10;
  const px = i => padL + (i * (W - padL - 8)) / (data.length - 1);
  const py = v => padT + (H - padT - padB) * (1 - v / max);

  // grid + y labels
  ctx.font = "11px Inter, sans-serif";
  ctx.fillStyle = dark ? "#64748b" : "#94a3b8";
  ctx.strokeStyle = dark ? "rgba(148,163,184,.12)" : "rgba(100,116,139,.15)";
  for (let g = 0; g <= 4; g++) {
    const v = (max / 4) * g, y = py(v);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - 8, y); ctx.stroke();
    ctx.fillText((v / 1000).toFixed(0) + "k", 8, y + 4);
  }
  // x labels
  const days = 14;
  for (let i = 0; i < days; i += 2) {
    const d = new Date(Date.now() - (days - 1 - i) * 86400000);
    ctx.fillText(d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), px(i) - 14, H - 8);
  }
  // area gradient
  const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
  grad.addColorStop(0, "rgba(99,102,241,.35)");
  grad.addColorStop(1, "rgba(99,102,241,0)");
  ctx.beginPath();
  ctx.moveTo(px(0), py(data[0]));
  data.forEach((v, i) => ctx.lineTo(px(i), py(v)));
  ctx.lineTo(px(data.length - 1), H - padB); ctx.lineTo(px(0), H - padB); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  // line
  ctx.beginPath();
  ctx.moveTo(px(0), py(data[0]));
  data.forEach((v, i) => ctx.lineTo(px(i), py(v)));
  ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.stroke();
  // last point
  ctx.beginPath(); ctx.arc(px(data.length - 1), py(data[data.length - 1]), 4, 0, 7);
  ctx.fillStyle = "#6366f1"; ctx.fill();
  ctx.strokeStyle = dark ? "#111827" : "#fff"; ctx.lineWidth = 2; ctx.stroke();
}
drawChart();
window.addEventListener("resize", drawChart);
window.addEventListener("fs-theme-change", drawChart);
document.getElementById("chart-range").addEventListener("change", drawChart);
