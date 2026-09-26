// FSComerce Admin — API keys settings (create, reveal once, revoke)
import { renderChrome, page, icons } from "./layout.js";
import { getDB, saveDB, uid, fmtDate, toast, confirmDialog } from "./store.js";

renderChrome("api", "API keys");
const db = getDB();

document.getElementById("page-content").innerHTML = page(
  "API keys", "Keys for the storefront and admin APIs",
  `<button class="btn btn-primary" id="new-key">${icons.plus} Create API key</button>`,
  `<div class="card"><div class="table-wrap">
    <table class="data">
      <thead><tr><th>Name</th><th>Type</th><th>Token</th><th>Created</th><th>Last used</th><th></th></tr></thead>
      <tbody id="rows"></tbody>
    </table></div></div>`
);

function tokenFor(k) {
  return k.revoked ? "—" : (k.type === "secret" ? "sk_" : "pk_") + k.id.slice(4) + "•".repeat(12);
}

function render() {
  document.getElementById("rows").innerHTML = db.apiKeys.map(k => `
    <tr>
      <td class="cell-title">${k.name}</td>
      <td><span class="badge ${k.type==="secret"?"purple":"blue"}">${k.type}</span></td>
      <td class="mono">${tokenFor(k)} ${!k.revoked ? `<button class="btn btn-sm btn-ghost" data-copy="${k.id}">⧉</button>` : ""}</td>
      <td>${fmtDate(k.created).split(",")[0]}</td>
      <td>${k.lastUsed ? fmtDate(k.lastUsed).split(",")[0] : "Never"}</td>
      <td class="right">${!k.revoked ? `<button class="btn btn-sm btn-ghost" data-rev="${k.id}" style="color:var(--red)">Revoke</button>` : `<span class="badge gray">revoked</span>`}</td>
    </tr>`).join("");

  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", () => {
    const k = db.apiKeys.find(x => x.id === b.dataset.copy);
    navigator.clipboard?.writeText(tokenFor(k));
    toast("Token copied");
  }));
  document.querySelectorAll("[data-rev]").forEach(b => b.addEventListener("click", async () => {
    if (!await confirmDialog("Revoke this key?", "Any integration using it will stop working immediately.", true)) return;
    db.apiKeys.find(x => x.id === b.dataset.rev).revoked = true;
    saveDB(db); toast("Key revoked", "warn"); render();
  }));
}
render();

document.getElementById("new-key").addEventListener("click", () => {
  const name = prompt("Name for this key:", "My integration");
  if (!name) return;
  const type = confirm("Secret key? (OK = secret, Cancel = publishable)") ? "secret" : "publishable";
  const k = { id: uid("key"), name, type, created: new Date().toISOString(), lastUsed: null, revoked: false };
  db.apiKeys.unshift(k); saveDB(db);
  toast(`Key created — ${tokenFor(k)}`);
  render();
});
