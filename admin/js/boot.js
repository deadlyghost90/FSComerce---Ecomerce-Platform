// FSComerce Admin — boot entry: wires Firebase sync into the shared store, then loads the page module.
import * as store from "./store.js";
import { initSync, installSaveHook } from "./fs-sync.js";

// Active-path resolver: supports pretty URLs (Vercel rewrites), real .html files, and
// launcher-style suffixes like admin/orders.html/index,home — used by layout.js for highlighting.
window.fsActivePath = function () {
  var files = ["index","orders","order-detail","products","product-detail","collections","customers",
    "inventory","promotions","analytics","sales","regions","themes","editor",
    "settings-store","settings-general","settings-users","settings-team","settings-api"];
  var cands = [];
  var m = decodeURIComponent(location.pathname || "").match(/([a-z][a-z-]*(?:-[a-z-]+)*)\.html/i)
       || decodeURIComponent(location.pathname || "").match(/\/([a-z][a-z-]*)$/i);
  if (m) cands.push(m[1]);
  var h = (location.hash || "").replace(/^#\/?/, "");
  if (h) cands.push(h.split(/[\/,]/)[0]);
  for (var i = 0; i < cands.length; i++) if (files.indexOf(cands[i]) !== -1) return cands[i];
  return "";
};

installSaveHook(store);
initSync(function () { location.reload(); }); // apply remote data on first arrival, live updates afterwards
