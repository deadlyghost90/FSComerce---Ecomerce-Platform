// FSComerce Admin — Users settings (sessions, password change form)
import { renderChrome, page } from "./layout.js";
import { toast } from "./store.js";

renderChrome("users", "Users");

document.getElementById("page-content").innerHTML = page(
  "My account", "Password and session security", "",
  `
  <div class="grid" style="grid-template-columns:2fr 1fr;">
    <div class="card card-pad">
      <div class="card-title mb-4">Change password</div>
      <div class="form-grid">
        <div class="field full"><label>Current password</label><input class="input" type="password" id="pw-cur" placeholder="••••••••"></div>
        <div class="field"><label>New password</label><input class="input" type="password" id="pw-new" placeholder="Min. 8 characters"></div>
        <div class="field"><label>Confirm new password</label><input class="input" type="password" id="pw-conf" placeholder="Repeat it"></div>
      </div>
      <div class="mt-4 right"><button class="btn btn-primary" id="pw-save">Update password</button></div>
    </div>
    <div class="card card-pad" style="align-self:start">
      <div class="card-title mb-4">Active sessions</div>
      <div class="list-row"><div><b>This device</b><div class="cell-sub">Chrome · Lahore, PK</div></div><span class="badge green">current</span></div>
      <div class="list-row"><div><b>iPhone 15</b><div class="cell-sub">Safari · 2 days ago</div></div><button class="btn btn-sm" data-rev>Revoke</button></div>
      <div class="list-row"><div><b>Work laptop</b><div class="cell-sub">Edge · 3 weeks ago</div></div><button class="btn btn-sm" data-rev>Revoke</button></div>
    </div>
  </div>`
);

document.getElementById("pw-save").addEventListener("click", () => {
  const cur = document.getElementById("pw-cur").value, nw = document.getElementById("pw-new").value, cf = document.getElementById("pw-conf").value;
  if (!cur) { toast("Enter your current password", "error"); return; }
  if (nw.length < 8) { toast("New password must be at least 8 characters", "error"); return; }
  if (nw !== cf) { toast("Passwords do not match", "error"); return; }
  toast("Password updated"); ["pw-cur","pw-new","pw-conf"].forEach(i => document.getElementById(i).value = "");
});
document.querySelectorAll("[data-rev]").forEach(b => b.addEventListener("click", () => {
  b.closest(".list-row").style.opacity = ".4"; b.disabled = true; toast("Session revoked", "warn");
}));
