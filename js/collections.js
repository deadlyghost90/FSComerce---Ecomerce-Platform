// FSComerce Admin — Collections page (list + create modal + manage products)
import { renderChrome, page, icons, modalShell, openModal } from "./layout.js";
import { getDB, saveDB, uid, toast, confirmDialog } from "./store.js";

renderChrome("collections", "Collections");
const db = getDB();

document.getElementById("page-content").innerHTML = page(
  "Collections", `${db.collections.length} collections`,
  `<button class="btn btn-primary" id="new-col">${icons.plus} Create</button>`,
  `<div class="card"><div class="table-wrap">
    <table class="data">
      <thead><tr><th>Title</th><th>Handle</th><th>Products</th><th></th></tr></thead>
      <tbody id="rows"></tbody>
    </table></div></div>`
) + modalShell("modal-new-col", "Create collection", `
  <div class="field mb-4"><label>Title *</label><input class="input" id="nc-title" placeholder="e.g. Summer Drop"></div>
  <div class="field"><label>Description</label><textarea class="input" id="nc-desc" rows="3" placeholder="Optional"></textarea></div>
`, `<button class="btn" onclick="closeModalById('modal-new-col')">Cancel</button><button class="btn btn-primary" id="nc-save">Save</button>`);

function render() {
  document.getElementById("rows").innerHTML = db.collections.map(c => `
    <tr>
      <td><div class="cell-title">${c.title}</div><div class="cell-sub">${c.description || ""}</div></td>
      <td class="mono">/${c.handle}</td>
      <td>${c.products.length} items</td>
      <td class="right">
        <button class="btn btn-sm" data-edit="${c.id}">Manage products</button>
        <button class="btn btn-sm btn-ghost" data-del="${c.id}" style="color:var(--red)">Delete</button>
      </td>
    </tr>`).join("") || `<tr><td colspan="4"><div class="empty-state"><div class="big">🗂️</div>No collections yet.</div></td></tr>`;

  document.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", async () => {
    const c = db.collections.find(x => x.id === b.dataset.del);
    if (!await confirmDialog("Delete collection?", `"${c.title}" will be removed. Products stay in your catalogue.`, true)) return;
    db.collections = db.collections.filter(x => x.id !== c.id);
    db.products.forEach(p => { if (p.collection === c.id) p.collection = ""; });
    saveDB(db); toast("Collection deleted", "warn"); render();
  }));

  document.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => {
    const c = db.collections.find(x => x.id === b.dataset.edit);
    const body = `
      <div class="mb-4"><b>${c.title}</b><div class="cell-sub">Select which products belong to this collection</div></div>
      ${db.products.map(p => `
        <label class="checkline list-row" style="display:flex">
          <span class="flex items-center gap-2"><input type="checkbox" data-mid="${p.id}" ${c.products.includes(p.id) ? "checked" : ""}> ${p.thumbnail} ${p.title}</span>
          <span class="chip">${p.status}</span>
        </label>`).join("")}`;
    document.body.insertAdjacentHTML("beforeend", modalShell("modal-manage", "Manage products", body,
      `<button class="btn" onclick="closeModalById('modal-manage')">Cancel</button><button class="btn btn-primary" id="mm-save">Save</button>`, true));
    openModal("modal-manage");
    document.getElementById("mm-save").addEventListener("click", () => {
      c.products = [...document.querySelectorAll("#modal-manage input[data-mid]")]
        .filter(i => i.checked).map(i => i.dataset.mid);
      db.products.forEach(p => { if (c.products.includes(p.id)) p.collection = c.id; });
      saveDB(db); toast("Collection updated");
      document.getElementById("modal-manage").remove(); render();
    });
  }));
}
render();

document.getElementById("new-col").addEventListener("click", () => openModal("modal-new-col"));
document.getElementById("nc-save").addEventListener("click", () => {
  const title = document.getElementById("nc-title").value.trim();
  if (!title) { toast("Title is required", "error"); return; }
  db.collections.push({ id: uid("col"), title, handle: title.toLowerCase().replace(/[^a-z0-9]+/g,"-"),
    description: document.getElementById("nc-desc").value.trim(), products: [] });
  saveDB(db); toast("Collection created");
  closeModalById("modal-new-col"); render();
});
