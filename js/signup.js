// FSComerce — store signup handler (creates the store, then enters the admin panel)
import { auth, database } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const form = document.getElementById("storeSignupForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = fd.get("email");
    const password = fd.get("password");
    const name = fd.get("name");
    const storeName = fd.get("store-name") || name;
    const type = fd.get("store-type");

    if (!email || !password || !name) {
      alert("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Persist store info (best-effort; works offline too via demo fallback)
      try {
        await set(ref(database, "stores/" + cred.user.uid), {
          owner: name, email, storeName, type, createdAt: Date.now()
        });
      } catch (dbErr) { console.warn("RTDB write skipped:", dbErr.message); }

      localStorage.setItem("fscomerce_session", JSON.stringify({ email, mode: "signup" }));
      sessionStorage.setItem("fscomerce_firebase_auth", "1");
      window.location.href = "admin/index.html?auth=demo";
    } catch (err) {
      const msg = /weak-password/i.test(err.message) ? "Password is too weak (min 6 chars)."
        : /email-already-in-use/i.test(err.message) ? "That email is already registered — try signing in."
        : err.message;
      alert("Sign up failed: " + msg);
    }
  });
}
