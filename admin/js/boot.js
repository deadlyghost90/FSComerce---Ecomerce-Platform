// FSComerce Admin — boot entry: wires Firebase sync into the shared store, then loads the page module.
import * as store from "./store.js";
import { initSync, installSaveHook } from "./fs-sync.js";

installSaveHook(store);
initSync(function () { location.reload(); }); // apply remote data on first arrival, live updates afterwards
