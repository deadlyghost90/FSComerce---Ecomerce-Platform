// FSComerce Admin — Product detail / create-edit page (tabs: details, pricing, inventory, organisation)
import { renderChrome } from "./layout.js";
import { getDB, saveDB, uid, fmtMoney, toast } from "./store.js";

renderChrome("products", "Product detail");
const db = getDB();
const params = new URLSearchParams(location.search);
const pid = params.get("id");
let p = db.products.find(x => x.id === pid);
const isNew = !p;
if (!p) {
  p = { id: uid("prd"), title: "", subtitle: "", description: "", handle: "", status: "draft", type: "Apparel",
        collection: "", tags: [], prices: [{ region: "PKR", amount: 0 }], inventory: 0, sales: 0, thumbnail: "🛍️",
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}
const draft = JSON.parse(JSON.stringify(p));

document.getElementById("page-content").innerHTML = `
  <div class="breadcrumb mb-4"><a href="products.html">Products</a><span class="sep">/</span><span class="current">${isNew ? "New product" : draft.title}</span></div>
  <div class="page-head">
    <div><h1>${isNew ? "New product" : draft.title}</h1><p class="sub">${isNew ? "Create a product to sell in your store" : `<span class="mono">${draft.id}</span>`}</p></div>
    <div class="head-actions">
      ${!isNew ? `<button class="btn" id="btn-unpublish">${draft.status === "active" ? "Unpublish" : "Publish"}</button>` : ""}
      <button class="btn btn-primary" id="btn-save">Save</button>
    </div>
  </div>

  <div class="tabs" id="tabs">
    <button class="tab active" data-tab="details">Details</button>
    <button class="tab" data-tab="pricing">Pricing</button>
    <button class="tab" data-tab="inventory">Inventory</button>
    <button class="tab" data-tab="org">Organisation</button>
  </div>

  <div class="grid" style="grid-template-columns:2fr 1fr;">
    <div>
      <section class="card card-pad" data-pane="details">
        <div class="form-grid">
          <div class="field full"><label>Title *</label><input class="input" id="f-title" value="${draft.title}" placeholder="e.g. Ghost Heavyweight Hoodie"></div>
          <div class="field full"><label>Subtitle</label><input class="input" id="f-subtitle" value="${draft.subtitle}" placeholder="Short selling line"></div>
          <div class="field full"><label>Description</label><textarea class="input" id="f-desc" rows="5" placeholder="Describe the product…">${draft.description}</textarea></div>
          <div class="field"><label>Handle *</label><input class="input mono" id="f-handle" value="${draft.handle}" placeholder="auto-generated"><span class="hint">URL slug for the storefront</span></div>
          <div class="field"><label>Product type</label>
            <select class="input" id="f-type">${["Apparel","Outerwear","Accessories","Jewelry","Footwear","Digital"].map(t=>`<option ${t===draft.type?"selected":""}>${t}</option>`).join("")}</select></div>
          <div class="field"><label>Emoji artwork</label><input class="input" id="f-thumb" value="${draft.thumbnail}" maxlength="4"><span class="hint">Used as thumbnail in this demo</span></div>
        </div>
      </section>

      <section class="card card-pad hidden-pane" data-pane="pricing" style="display:none">
        <div class="flex between items-center mb-4"><div class="card-title">Prices by region</div>
          <button class="btn btn-sm" id="add-price">${"+ Add price"}</button></div>
        <div id="price-rows"></div>
      </section>

      <section class="card card-pad" data-pane="inventory" style="display:none">
        <div class="form-grid">
          <div class="field"><label>Available quantity</label><input class="input" type="number" id="f-inv" value="${draft.inventory}" min="0"></div>
          <div class="field"><label>&nbsp;</label><label class="checkline" style="margin-top:8px"><span class="switch"><input type="checkbox" checked id="f-track"><span class="slider"></span></span> Track inventory for this product</label></div>
        </div>
        <div class="mt-4 muted" style="font-size:12.5px">Lifetime sales: <b>${draft.sales}</b> units · Created ${new Date(draft.createdAt).toLocaleDateString()}</div>
      </section>

      <section class="card card-pad" data-pane="org" style="display:none">
        <div class="form-grid">
          <div class="field"><label>Collection</label>
            <select class="input" id="f-col"><option value="">— None —</option>
              ${db.collections.map(c => `<option value="${c.id}" ${c.id===draft.collection?"selected":""}>${c.title}</option>`).join("")}</select></div>
          <div class="field"><label>Tags</label><input class="input" id="f-tags" value="${draft.tags.join(", ")}" placeholder="hoodie, streetwear"><span class="hint">Comma separated</span></div>
        </div>
      </section>
    </div>

    <aside class="card card-pad" style="align-self:start">
      <div class="card-title mb-4">Preview</div>
      <div class="flex items-center gap-3 mb-4"><div class="thumb" style="width:64px;height:64px;font-size:34px" id="pv-thumb">${draft.thumbnail}</div>
        <div><div class="cell-title" id="pv-title">${draft.title || "Untitled product"}</div><div class="cell-sub" id="pv-price">${fmtMoney(draft.prices[0]?.amount || 0)}</div></div></div>
      <div class="kv"><span class="k">Status</span><span class="v"><span class="badge ${draft.status==="active"?"green":draft.status==="draft"?"amber":"gray"}" id="pv-status">${draft.status}</span></span></div>
      <div class="kv"><span class="k">Type</span><span class="v" id="pv-type">${draft.type}</span></div>
      <div class="kv"><span class="k">Handle</span><span class="v mono" id="pv-handle">${draft.handle || "—"}</span></div>
    </aside>
  </div>`;

// Tabs
document.querySelectorAll("#tabs .tab").forEach(t => t.addEventListener("click", () => {
  document.querySelectorAll("#tabs .tab").forEach(x => x.classList.remove("active"));
  t.classList.add("active");
  document.querySelectorAll("[data-pane]").forEach(s => { s.style.display = s.dataset.pane === t.dataset.tab ? "" : "none"; });
}));

// Pricing rows
function paintPrices() {
  const wrap = document.getElementById("price-rows");
  wrap.innerHTML = draft.prices.map((pr, i) => `
    <div class="flex gap-2 mb-4" style="align-items:flex-end">
      <div class="field" style="flex:1"><label>Region</label>
        <select class="input" data-pi="${i}" data-pf="region">${db.regions.map(r => `<option ${r.currency===pr.region?"selected":""}>${r.currency}</option>`).join("")}</select></div>
      <div class="field" style="flex:1"><label>Amount (${pr.region})</label>
        <input class="input" type="number" min="0" value="${pr.amount}" data-pi="${i}" data-pf="amount"></div>
      <button class="btn btn-sm" data-prm="${i}" style="color:var(--red);margin-bottom:2px">✕</button>
    </div>`).join("") || `<div class="muted">No prices yet — add one.</div>`;
  wrap.querySelectorAll("[data-pi]").forEach(el => el.addEventListener("change", () => {
    const i = +el.dataset.pi;
    draft.prices[i][el.dataset.pf] = el.dataset.pf === "amount" ? Number(el.value) : el.value;
    paintPrices(); refreshPreview();
  }));
  wrap.querySelectorAll("[data-prm]").forEach(b => b.addEventListener("click", () => {
    draft.prices.splice(+b.dataset.prm, 1); paintPrices(); refreshPreview();
  }));
}
paintPrices();
document.getElementById("add-price").addEventListener("click", () => {
  draft.prices.push({ region: db.regions[draft.prices.length % db.regions.length].currency, amount: 0 });
  paintPrices(); refreshPreview();
});

// Live preview
function refreshPreview() {
  document.getElementById("pv-title").textContent = draft.title || "Untitled product";
  document.getElementById("pv-thumb").textContent = draft.thumbnail;
  document.getElementById("pv-price").textContent = fmtMoney(draft.prices[0]?.amount || 0);
  document.getElementById("pv-type").textContent = draft.type;
  document.getElementById("pv-handle").textContent = draft.handle || "—";
}
["f-title","f-subtitle","f-desc","f-handle","f-type","f-thumb"].forEach(idf => {
  document.getElementById(idf).addEventListener("input", e => {
    const map = { "f-title":"title","f-subtitle":"subtitle","f-desc":"description","f-handle":"handle","f-type":"type","f-thumb":"thumbnail" };
    draft[map[idf]] = e.target.value;
    if (idf === "f-title" && !document.getElementById("f-handle").value) {
      draft.handle = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
      document.getElementById("f-handle").value = draft.handle;
    }
    refreshPreview();
  });
});

// Save
document.getElementById("btn-save").addEventListener("click", () => {
  if (!draft.title.trim()) { toast("Title is required", "error"); return; }
  if (!draft.handle.trim()) draft.handle = draft.title.toLowerCase().replace(/[^a-z0-9]+/g,"-");
  draft.inventory = Number(document.getElementById("f-inv").value) || 0;
  draft.collection = document.getElementById("f-col") ? document.getElementById("f-col").value : draft.collection;
  draft.tags = document.getElementById("f-tags").value.split(",").map(t=>t.trim()).filter(Boolean);
  draft.updatedAt = new Date().toISOString();
  if (isNew) {
    db.products.unshift(JSON.parse(JSON.stringify(draft)));
    toast("Product created");
    setTimeout(() => location.href = "product-detail.html?id=" + draft.id, 600);
  } else {
    const idx = db.products.findIndex(x => x.id === draft.id);
    db.products[idx] = JSON.parse(JSON.stringify(draft));
    toast("Product saved");
  }
  saveDB(db);
});

// Publish / unpublish
const up = document.getElementById("btn-unpublish");
if (up) up.addEventListener("click", () => {
  draft.status = draft.status === "active" ? "draft" : "active";
  const idx = db.products.findIndex(x => x.id === draft.id);
  db.products[idx].status = draft.status; saveDB(db);
  toast(`Product ${draft.status === "active" ? "published" : "unpublished"}`);
  setTimeout(() => location.reload(), 600);
});
