// FSComerce Admin — Analytics page (date range, KPIs, canvas charts, channel table)
import { renderChrome, page } from "./layout.js";
import { getDB, fmtMoney } from "./store.js";

renderChrome("analytics", "Analytics");
const db = getDB();

document.getElementById("page-content").innerHTML = page(
  "Analytics", "Understand how your store is performing",
  `<select class="filter" id="range"><option>Last 7 days</option><option selected>Last 30 days</option><option>Last 90 days</option></select>
   <button class="btn" id="export-csv">Export CSV</button>`,
  `
  <div class="grid grid-4 mb-4">
    <div class="card stat"><div class="s-label">Gross sales <span class="trend up">+18%</span></div><div class="s-value">${fmtMoney(db.orders.reduce((s,o)=>s+o.total,0))}</div></div>
    <div class="card stat"><div class="s-label">Sessions <span class="trend up">+6%</span></div><div class="s-value">7,312</div></div>
    <div class="card stat"><div class="s-label">Conversion <span class="trend up">+0.4%</span></div><div class="s-value">3.8%</div></div>
    <div class="card stat"><div class="s-label">Refunds <span class="trend down">-2%</span></div><div class="s-value">${fmtMoney(db.orders.flatMap(o=>o.refunds).reduce((s,r)=>s+r.amount,0))}</div></div>
  </div>
  <div class="grid grid-2 mb-4">
    <div class="card card-pad"><div class="card-title mb-4">Sales by day</div><canvas id="c-bars" height="240"></canvas></div>
    <div class="card card-pad"><div class="card-title mb-4">Traffic sources</div><canvas id="c-donut" height="240"></canvas></div>
  </div>
  <div class="card">
    <div style="padding:16px 20px;border-bottom:1px solid var(--border)" class="card-title">Products by revenue</div>
    <div class="table-wrap"><table class="data">
      <thead><tr><th>Product</th><th>Units</th><th>Revenue</th><th style="width:34%">Share</th></tr></thead>
      <tbody id="prod-rows"></tbody>
    </table></div>
  </div>`
);

// Product revenue table
const prods = [...db.products].sort((a,b)=> (b.sales*b.prices[0].amount) - (a.sales*a.prices[0].amount));
const maxRev = prods[0].sales * prods[0].prices[0].amount;
document.getElementById("prod-rows").innerHTML = prods.map(p => {
  const rev = p.sales * p.prices[0].amount;
  return `<tr>
    <td><div class="flex items-center gap-3"><div class="thumb">${p.thumbnail}</div><div class="cell-title">${p.title}</div></div></td>
    <td>${p.sales}</td><td><b>${fmtMoney(rev)}</b></td>
    <td><div class="progress"><div style="width:${Math.round(rev/maxRev*100)}%"></div></div></td>
  </tr>`;
}).join("");

// Canvas helpers
function prep(id) {
  const c = document.getElementById(id);
  const dpr = window.devicePixelRatio || 1;
  const W = c.clientWidth = c.parentElement.clientWidth - 40;
  const H = 240;
  c.width = W * dpr; c.height = H * dpr;
  const ctx = c.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0,0,W,H);
  return { c, ctx, W, H };
}

function drawBars() {
  const { ctx, W, H } = prep("c-bars");
  const dark = document.documentElement.classList.contains("dark");
  const data = [42,58,50,71,66,83,61,90,74,88,95,79,102,86];
  const max = Math.max(...data)*1.15;
  const padL=36,padB=24,padT=8, bw=(W-padL-10)/data.length;
  ctx.font="11px Inter"; ctx.fillStyle=dark?"#64748b":"#94a3b8";
  for(let g=0;g<=4;g++){const val=max/4*g; const y=padT+(H-padT-padB)*(1-val/max);
    ctx.strokeStyle=dark?"rgba(148,163,184,.12)":"rgba(100,116,139,.15)";
    ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(W-6,y);ctx.stroke();
    ctx.fillStyle=dark?"#64748b":"#94a3b8"; ctx.fillText(Math.round(val)+"k",6,y+4);}
  data.forEach((v,i)=>{
    const h=(H-padT-padB)*(v/max), x=padL+i*bw+bw*0.18, y=H-padB-h;
    const grad=ctx.createLinearGradient(0,y,0,H-padB);
    grad.addColorStop(0,"#6366f1"); grad.addColorStop(1,"#a855f7");
    ctx.fillStyle=grad;
    ctx.beginPath(); ctx.roundRect(x,y,bw*0.64,h,[5,5,0,0]); ctx.fill();
  });
  ctx.fillStyle=dark?"#64748b":"#94a3b8";
  for(let i=0;i<data.length;i+=2){const d=new Date(Date.now()-(13-i)*86400000);
    ctx.fillText(d.toLocaleDateString("en-GB",{day:"numeric",month:"short"}),padL+i*bw,H-8);}
}

function drawDonut() {
  const { ctx, W, H } = prep("c-donut");
  const segs=[["Direct",38,"#6366f1"],["Social",27,"#a855f7"],["Search",22,"#22d3ee"],["Email",13,"#f59e0b"]];
  const cx=W/2-70, cy=H/2, r=80, ir=52;
  let a=-Math.PI/2;
  segs.forEach(s=>{
    const ang=s[1]/100*Math.PI*2;
    ctx.beginPath(); ctx.arc(cx,cy,r,a,a+ang); ctx.arc(cx,cy,ir,a+ang,a,true); ctx.closePath();
    ctx.fillStyle=s[2]; ctx.fill(); a+=ang;
  });
  ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--text")||"#0f172a";
  ctx.font="700 20px Inter"; ctx.textAlign="center"; ctx.fillText("7.3k",cx,cy-2);
  ctx.font="11px Inter"; ctx.fillStyle="#94a3b8"; ctx.fillText("sessions",cx,cy+16); ctx.textAlign="left";
  segs.forEach((s,i)=>{
    const y=cy-((segs.length-1)*26)/2+i*26;
    ctx.fillStyle=s[2]; ctx.beginPath(); ctx.arc(cx+r+40,y-4,5,0,7); ctx.fill();
    ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--text")||"#0f172a";
    ctx.font="600 12.5px Inter"; ctx.fillText(`${s[0]} · ${s[1]}%`,cx+r+54,y);
  });
}

drawBars(); drawDonut();
window.addEventListener("resize", ()=>{drawBars();drawDonut();});
window.addEventListener("fs-theme-change", ()=>{drawBars();drawDonut();});

document.getElementById("export-csv").addEventListener("click", () => {
  const rows = [["Date","Order","Customer","Total"], ...db.orders.map(o=>[o.date,o.displayId,o.customerName,o.total])];
  const csv = rows.map(r=>r.join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "orders-export.csv"; a.click();
});
