// FSComerce Admin — Team settings (invite members, roles, revoke invites)
import { renderChrome, page, icons, modalShell, openModal, closeModal } from "./layout.js";
import { getDB, saveDB, uid, toast, confirmDialog } from "./store.js";

renderChrome("team", "Team");
const db = getDB();

document.getElementById("page-content").innerHTML = page(
  "Team", "People with access to this store",
  `<button class="btn btn-primary" id="invite-btn">${icons.plus} Invite member</button>`,
  `<div class="card"><div class="table-wrap">
    <table class="data">
      <thead><tr><th>Member</th><th>Email</th><th>Role</th><th>Invited by</th><th></th></tr></thead>
      <tbody id="rows"></tbody>
    </table></div></div>`
) + modalShell("modal-invite", "Invite a team member", `
  <div class="field mb-4"><label>Email *</label><input class="input" id="iv-email" type="email" placeholder="teammate@example.com"></div>
  <div class="field"><label>Role</label><select class="input" id="iv-role"><option>Admin</option><option>Developer</option><option>Viewer</option></select></div>
`, `<button class="btn" onclick="closeModalById('modal-invite')">Cancel</button><button class="btn btn-primary" id="iv-send">Send invite</button>`);

const RB = { Owner: "purple", Admin: "blue", Developer: "amber", Viewer: "gray" };

function render() {
  document.getElementById("rows").innerHTML = db.users.map(u => `
    <tr>
      <td><div class="flex items-center gap-3"><div class="avatar">${u.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div><div class="cell-title">${u.name}</div></div></td>
      <td>${u.email}</td>
      <td><span class="badge ${RB[u.role]||"gray"}">${u.role}</span></td>
      <td>${u.invitedBy}</td>
      <td class="right">${u.role !== "Owner" ? `<button class="btn btn-sm btn-ghost" data-rm="${u.id}" style="color:var(--red)">Remove</button>` : ""}</td>
    </tr>`).join("");
  document.querySelectorAll("[data-rm]").forEach(b => b.addEventListener("click", async () => {
    const u = db.users.find(x => x.id === b.dataset.rm);
    if (!await confirmDialog("Remove member?", `${u.name} will immediately lose access to this store.`, true)) return;
    db.users = db.users.filter(x => x.id !== u.id);
    saveDB(db); toast("Member removed", "warn"); render();
  }));
}
render();

document.getElementById("invite-btn").addEventListener("click", () => openModal("modal-invite"));
document.getElementById("iv-send").addEventListener("click", () => {
  const email = document.getElementById("iv-email").value.trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast("Enter a valid email", "error"); return; }
  if (db.users.some(u => u.email === email)) { toast("Already a member", "warn"); return; }
  db.users.push({ id: uid("usr"), name: email.split("@")[0].replace(/[._]/g," ").replace(/\b\w/g,c=>c.toUpperCase()), email,
    role: document.getElementById("iv-role").value, invitedBy: "Mohsin Ilyas" });
  saveDB(db); toast(`Invite sent to ${email}`); closeModal("modal-invite"); render();
});
