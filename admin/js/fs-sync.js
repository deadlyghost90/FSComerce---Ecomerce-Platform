// FSComerce Firebase Realtime Database sync layer (ES module).
// Loads shared store data over the localStorage cache; saves flow back to RTDB.
// Works offline: falls back to localStorage, queues writes and flushes when online.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set as fbSet, get as fbGet } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCwvC1MlB-_7cmV-Hmi8MyXthGrFUGbwkY",
  authDomain: "fscomerce.firebaseapp.com",
  databaseURL: "https://fscomerce-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fscomerce",
  storageBucket: "fscomerce.firebasestorage.app",
  messagingSenderId: "977420297543",
  appId: "1:977420297543:web:b005a014795112c24a9862"
};

const DB_KEY = "fscomerce_db_v1";
let connected = false, queue = {}, dbRef = null, liveSub = false;

function local() { try { return JSON.parse(localStorage.getItem(DB_KEY) || "null") || {}; } catch (e) { return {}; } }
function writeLocal(d) { localStorage.setItem(DB_KEY, JSON.stringify(d)); }

function push(d) {
  if (connected && dbRef) { dbRef.set(JSON.parse(JSON.stringify(d))).catch(function (e) { console.warn("[FS] save failed:", e.message); }); return true; }
  queue.pending = d; return false;
}
function flushQueue() {
  var p = queue.pending; queue = {};
  if (p && connected && dbRef) dbRef.set(p).catch(function () {});
}

export function initSync(onRemoteUpdate) {
  var app;
  try { app = initializeApp(FIREBASE_CONFIG); } catch (e) { try { app = { name: "[DEFAULT]" }; } catch (e2) {} }
  try {
    var db = getDatabase(app);
    dbRef = ref(db, "stores/demo-store/adminData");
    fbGet(dbRef).then(function (snap) {
      var v = snap.val();
      connected = true;
      if (v && (v.products || v.orders || v.store)) {
        writeLocal(v);
        if (typeof onRemoteUpdate === "function") onRemoteUpdate(v);
      } else {
        var l = local(); if (Object.keys(l).length) dbRef.set(l).catch(function () {});
      }
      flushQueue();
      if (!liveSub) { liveSub = true; onValue(dbRef, function (s) { var val = s.val(); if (val && Object.keys(val).length) { writeLocal(val); if (typeof onRemoteUpdate === "function") onRemoteUpdate(val); } }); }
      console.log("[FS] Firebase RTDB connected:", FIREBASE_CONFIG.databaseURL);
      window.dispatchEvent(new CustomEvent("fs:connected"));
    }).catch(function (err) { console.warn("[FS] RTDB unavailable (enable Database + rules):", err.message); });
  } catch (e) { console.warn("[FS] sync init failed:", e.message); }
}

// Wrap saveDB so every page save also reaches Firebase.
export function installSaveHook(storeModule) {
  var orig = storeModule.saveDB;
  Object.defineProperty(storeModule, "saveDB", {
    value: function (db) { orig(db); push(db); },
    writable: true, configurable: true
  });
  window.__fsPush = push; // used by non-module scripts (adminDashboard.html)
}
