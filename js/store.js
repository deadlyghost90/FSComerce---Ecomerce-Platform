// Shared helpers for all FSComerce admin pages (localStorage mock layer)
export const DB_KEY = "fscomerce_db_v1";

export function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn("[FSComerce] DB parse error", e); }
  return null;
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function getDemoData() {
  const now = Date.now();
  const day = 86400000;
  const iso = (offsetDays) => new Date(now - offsetDays * day).toISOString();
  return {
    store: {
      name: "Deadly Ghost Gear",
      handle: "deadly-ghost-gear",
      email: "owner@fscommerce.com",
      currency: "PKR",
      type: "Fashion & Apparel",
      createdAt: iso(90)
    },
    products: [
      { id: "prd_001", title: "Ghost Heavyweight Hoodie", subtitle: "Premium 450GSM fleece", description: "Ultra-heavy hoodie with embroidered ghost logo.", handle: "ghost-hoodie", status: "active", type: "Apparel", collection: "col_001", tags: ["hoodie", "streetwear"], prices: [{ region: "PKR", amount: 4999 }, { region: "USD", amount: 18 }], inventory: 52, sales: 140, thumbnail: "🧥", createdAt: iso(60), updatedAt: iso(3) },
      { id: "prd_002", title: "Shadow Cargo Pants", subtitle: "Ripstop tactical fit", description: "Six-pocket ripstop cargo pants.", handle: "shadow-cargo", status: "active", type: "Apparel", collection: "col_001", tags: ["pants"], prices: [{ region: "PKR", amount: 5999 }, { region: "USD", amount: 22 }], inventory: 8, sales: 96, thumbnail: "👖", createdAt: iso(55), updatedAt: iso(5) },
      { id: "prd_003", title: "Spectral Graphic Tee", subtitle: "100% combed cotton", description: "Oversized boxy tee with back print.", handle: "spectral-tee", status: "active", type: "Apparel", collection: "col_002", tags: ["tee"], prices: [{ region: "PKR", amount: 1899 }], inventory: 120, sales: 310, thumbnail: "👕", createdAt: iso(50), updatedAt: iso(1) },
      { id: "prd_004", title: "Phantom Bomber Jacket", subtitle: "Water-resistant shell", description: "MA-1 style bomber with quilted lining.", handle: "phantom-bomber", status: "draft", type: "Outerwear", collection: "col_001", tags: ["jacket"], prices: [{ region: "PKR", amount: 12999 }], inventory: 15, sales: 0, thumbnail: "🧥", createdAt: iso(20), updatedAt: iso(2) },
      { id: "prd_005", title: "Wraith Snapback Cap", subtitle: "Embroidered 3D logo", description: "Structured six-panel snapback.", handle: "wraith-cap", status: "active", type: "Accessories", collection: "col_002", tags: ["cap"], prices: [{ region: "PKR", amount: 1499 }], inventory: 74, sales: 88, thumbnail: "🧢", createdAt: iso(45), updatedAt: iso(7) },
      { id: "prd_006", title: "Ectoplasm Drip Bottle", subtitle: "750ml matte finish", description: "Stainless steel insulated bottle.", handle: "drip-bottle", status: "archived", type: "Accessories", collection: "col_003", tags: ["gadget"], prices: [{ region: "PKR", amount: 999 }], inventory: 0, sales: 45, thumbnail: "🍶", createdAt: iso(80), updatedAt: iso(30) },
      { id: "prd_007", title: "Haunted Chain Necklace", subtitle: "Stainless steel curb chain", description: "Tarnish-free layered chain.", handle: "haunted-chain", status: "active", type: "Jewelry", collection: "col_003", tags: ["jewelry"], prices: [{ region: "PKR", amount: 2499 }], inventory: 5, sales: 61, thumbnail: "📿", createdAt: iso(40), updatedAt: iso(4) },
      { id: "prd_008", title: "Grim Reaper Tee", subtitle: "Limited drop", description: "Limited edition screen-printed tee.", handle: "grim-tee", status: "active", type: "Apparel", collection: "col_001", tags: ["tee", "limited"], prices: [{ region: "PKR", amount: 2199 }], inventory: 33, sales: 205, thumbnail: "💀", createdAt: iso(15), updatedAt: iso(1) }
    ],
    collections: [
      { id: "col_001", title: "Streetwear Essentials", handle: "streetwear", description: "Everyday staples with a dark twist.", products: ["prd_001", "prd_002", "prd_004", "prd_008"] },
      { id: "col_002", title: "New Arrivals", handle: "new-arrivals", description: "Fresh drops weekly.", products: ["prd_003", "prd_005"] },
      { id: "col_003", title: "Accessories", handle: "accessories", description: "Complete the look.", products: ["prd_006", "prd_007"] }
    ],
    categories: [
      { id: "cat_001", name: "Apparel", parent: null },
      { id: "cat_002", name: "Hoodies & Tees", parent: "cat_001" },
      { id: "cat_003", name: "Pants", parent: "cat_001" },
      { id: "cat_004", name: "Accessories", parent: null },
      { id: "cat_005", name: "Headwear", parent: "cat_004" }
    ],
    orders: [
      { id: "ord_1042", displayId: "#1042", customerName: "Ayesha Khan", email: "ayesha@example.com", date: iso(0), fulfillment: "not_fulfilled", payment: "captured", total: 6898, currency: "PKR", sales: [{ title: "Ghost Heavyweight Hoodie", qty: 1, price: 4999 }, { title: "Wraith Snapback Cap", qty: 1, price: 1499 }, { title: "Shipping", qty: 1, price: 400 }], refunds: [] },
      { id: "ord_1041", displayId: "#1041", customerName: "Bilal Ahmed", email: "bilal@example.com", date: iso(0), fulfillment: "not_fulfilled", payment: "awaiting", total: 2199, currency: "PKR", sales: [{ title: "Grim Reaper Tee", qty: 1, price: 2199 }], refunds: [] },
      { id: "ord_1040", displayId: "#1040", customerName: "Sara Malik", email: "sara@example.com", date: iso(1), fulfillment: "shipped", payment: "captured", total: 11998, currency: "PKR", sales: [{ title: "Shadow Cargo Pants", qty: 2, price: 5999 }, { title: "Shipping", qty: 1, price: 0 }], refunds: [] },
      { id: "ord_1039", displayId: "#1039", customerName: "Hamza Raza", email: "hamza@example.com", date: iso(2), fulfillment: "fulfilled", payment: "captured", total: 4999, currency: "PKR", sales: [{ title: "Ghost Heavyweight Hoodie", qty: 1, price: 4999 }], refunds: [] },
      { id: "ord_1038", displayId: "#1038", customerName: "Zoya Farooq", email: "zoya@example.com", date: iso(3), fulfillment: "returned", payment: "refunded", total: 3398, currency: "PKR", sales: [{ title: "Spectral Graphic Tee", qty: 2, price: 1899 }], refunds: [{ amount: 3398, reason: "Damaged on arrival", date: iso(5) }] },
      { id: "ord_1037", displayId: "#1037", customerName: "Usman Tariq", email: "usman@example.com", date: iso(6), fulfillment: "shipped", payment: "captured", total: 8498, currency: "PKR", sales: [{ title: "Ghost Heavyweight Hoodie", qty: 1, price: 4999 }, { title: "Shadow Cargo Pants", qty: 1, price: 5999 }], refunds: [] },
      { id: "ord_1036", displayId: "#1036", customerName: "Mahnoor Ali", email: "mahnoor@example.com", date: iso(9), fulfillment: "fulfilled", payment: "captured", total: 3998, currency: "PKR", sales: [{ title: "Haunted Chain Necklace", qty: 1, price: 2499 }, { title: "Wraith Snapback Cap", qty: 1, price: 1499 }], refunds: [] },
      { id: "ord_1035", displayId: "#1035", customerName: "Guest Customer", email: "guest@example.com", date: iso(12), fulfillment: "canceled", payment: "canceled", total: 1899, currency: "PKR", sales: [{ title: "Spectral Graphic Tee", qty: 1, price: 1899 }], refunds: [] }
    ],
    customers: [
      { id: "cus_001", name: "Ayesha Khan", email: "ayesha@example.com", phone: "+92 300 1112233", joined: iso(40), orders: 6, spent: 28400 },
      { id: "cus_002", name: "Bilal Ahmed", email: "bilal@example.com", phone: "+92 301 2223344", joined: iso(25), orders: 2, spent: 4398 },
      { id: "cus_003", name: "Sara Malik", email: "sara@example.com", phone: "+92 333 5556677", joined: iso(70), orders: 9, spent: 51200 },
      { id: "cus_004", name: "Hamza Raza", email: "hamza@example.com", phone: "+92 345 7778899", joined: iso(15), orders: 1, spent: 4999 },
      { id: "cus_005", name: "Zoya Farooq", email: "zoya@example.com", phone: "+92 321 9990011", joined: iso(90), orders: 4, spent: 15600 },
      { id: "cus_006", name: "Usman Tariq", email: "usman@example.com", phone: "+92 302 4445566", joined: iso(35), orders: 3, spent: 18990 }
    ],
    promotions: [
      { id: "pro_001", code: "GHOST10", type: "discount", value: 10, unit: "%", scope: "order", status: "active", startsAt: iso(20), endsAt: null, usage: 45, limit: 500 },
      { id: "pro_002", code: "FREESHIP", type: "free_shipping", value: 0, unit: "", scope: "shipping", status: "active", startsAt: iso(10), endsAt: null, usage: 12, limit: null },
      { id: "pro_003", code: "HALLOWEEN", type: "discount", value: 25, unit: "%", scope: "product", status: "scheduled", startsAt: null, endsAt: null, usage: 0, limit: 200 }
    ],
    regions: [
      { id: "reg_pkr", name: "Pakistan", currency: "PKR", countries: ["Pakistan"] },
      { id: "reg_usd", name: "International", currency: "USD", countries: ["United States", "United Kingdom", "UAE"] }
    ],
    users: [
      { id: "usr_001", name: "Mohsin Ilyas", email: "owner@fscommerce.com", role: "Owner", invitedBy: "—" },
      { id: "usr_002", name: "Admin Assistant", email: "admin@fscommerce.com", role: "Admin", invitedBy: "Mohsin Ilyas" }
    ],
    apiKeys: [
      { id: "key_001", name: "Publishable Key", type: "publishable", created: iso(80), lastUsed: iso(0), revoked: false },
      { id: "key_002", name: "Secret Key", type: "secret", created: iso(80), lastUsed: iso(1), revoked: false }
    ]
  };
}

export function getDB() {
  let db = loadDB();
  if (!db) {
    db = getDemoData();
    saveDB(db);
  }
  return db;
}

export function resetDB() {
  saveDB(getDemoData());
}

export function uid(prefix) {
  return prefix + "_" + Math.random().toString(36).slice(2, 10);
}

export function fmtMoney(amount, currency) {
  return (currency || "PKR") + ". " + Number(amount || 0).toLocaleString();
}

export function fmtDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) +
       ", " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function timeAgo(isoStr) {
  const s = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + " min ago";
  if (s < 86400) return Math.floor(s / 3600) + " hours ago";
  return Math.floor(s / 86400) + " days ago";
}

// Auth guard used by every admin page. Falls back to demo session when Firebase is unreachable.
const AUTH_KEY = "fscomerce_session";

export function guardAuth() {
  const params = new URLSearchParams(location.search);
  if (params.get("auth") === "demo") {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email: "demo@fscommerce.com", mode: "demo" }));
  }
  const hasLocal = !!localStorage.getItem(AUTH_KEY);
  if (!hasLocal) {
    try {
      const authed = sessionStorage.getItem("fscomerce_firebase_auth") === "1";
      if (!authed) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ email: "demo@fscommerce.com", mode: "demo" }));
      }
    } catch (e) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ email: "demo@fscommerce.com", mode: "demo" }));
    }
  }
  const session = JSON.parse(localStorage.getItem(AUTH_KEY));
  const el = document.getElementById("user-email");
  if (el) el.textContent = session.email;
  return session;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem("fscomerce_firebase_auth");
  location.href = "signin.html";
}

// Toast notifications
export function toast(message, type) {
  let wrap = document.getElementById("toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "toast-wrap";
    wrap.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:100;display:flex;flex-direction:column;gap:8px;";
    document.body.appendChild(wrap);
  }
  const t = document.createElement("div");
  const color = type === "error" ? "#ef4444" : type === "warn" ? "#f59e0b" : "#10b981";
  t.style.cssText = "background:#0f172a;color:#fff;padding:12px 18px;border-radius:10px;font-size:14px;border-left:4px solid " + color + ";box-shadow:0 10px 30px rgba(0,0,0,.3);opacity:0;transform:translateY(8px);transition:all .25s;max-width:340px;";
  t.textContent = message;
  wrap.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = "1"; t.style.transform = "translateY(0)"; });
  setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3200);
}

// Confirm dialog (returns Promise<boolean>)
export function confirmDialog(title, body, danger) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,.6);backdrop-filter:blur(4px);z-index:120;display:flex;align-items:center;justify-content:center;";
    overlay.innerHTML =
      '<div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;max-width:420px;width:92%;box-shadow:0 25px 60px rgba(0,0,0,.35)">' +
      '<h3 style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:8px">' + title + "</h3>" +
      '<p style="font-size:14px;color:var(--text-2);line-height:1.6;margin-bottom:20px">' + body + "</p>" +
      '<div style="display:flex;gap:10px;justify-content:flex-end">' +
      '<button data-x="cancel" style="padding:10px 18px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text-2);font-weight:600;cursor:pointer">Cancel</button>' +
      '<button data-x="ok" style="padding:10px 18px;border-radius:10px;border:none;background:' + (danger ? "#ef4444" : "#4f46e5") + ';color:#fff;font-weight:600;cursor:pointer">Confirm</button>' +
      "</div></div>";
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => {
      const x = e.target.getAttribute && e.target.getAttribute("data-x");
      if (x === "ok") { overlay.remove(); resolve(true); }
      else if (x === "cancel" || e.target === overlay) { overlay.remove(); resolve(false); }
    });
  });
}
