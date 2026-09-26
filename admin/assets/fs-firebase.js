/* FSComerce Firebase Realtime Database sync layer.
   Loads shared store data (texts/settings/orders/themes) over localStorage cache.
   Works offline: falls back to localStorage; queues writes and flushes when online. */
(function(){
  var FIREBASE_CONFIG={apiKey:"AIzaSyDcJenFPPzgYEPveBkNbeQ3d7bAmmy6zNs",authDomain:"fscomerce.firebaseapp.com",databaseURL:"https://fscomerce-default-rtdb.europe-west1.firebasedatabase.app",projectId:"fscomerce",storageBucket:"fscomerce.firebasestorage.app",messagingSenderId:"984206437519",appId:"1:984206437519:web:c9aebe8979aa9f7d4ac0ba"};
  var KEY='gc-demo', STORE_ID=(function(){try{var d=JSON.parse(localStorage.getItem(KEY)||'{}');return d.storeId||'demo-store'}catch(e){return 'demo-store'}})();
  var dbUrl=FIREBASE_CONFIG.databaseURL, online=false, pending={}, fs=null;
  try{fs=window.firebase}catch(e){}
  function loadLocal(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||{}}catch(e){return {}}}
  function saveLocal(d){localStorage.setItem(KEY,JSON.stringify(d))}
  function merge(remote){ if(!remote) return; var local=loadLocal();
    // remote wins for shared keys; keep local-only keys (theme pref etc.) unless remote has them
    Object.keys(remote).forEach(function(k){local[k]=remote[k]});
    saveLocal(local); window.dispatchEvent(new CustomEvent('fs:data-updated',{detail:local})); }
  function put(path,val){ if(online&&fs&&fs.database){ try{fs.database().ref('stores/'+STORE_ID+'/'+path).set(val);return true}catch(e){} }
    pending[path]=val; return false; }
  function flush(){ if(!pending) return; var p=pending; pending={}; Object.keys(p).forEach(function(k){put(k,p[k])}); }
  function boot(){
    var app=null;
    try{ if(fs&&!fs.apps.length) app=fs.initializeApp(FIREBASE_CONFIG); else if(fs&&fs.apps[0]) app=fs.apps[0]; }catch(e){}
    if(!app){ console.warn('[FS] Firebase unavailable — running on local storage only'); return; }
    try{
      var db=fs.database(app), ref=db.ref('stores/'+STORE_ID+'/data');
      ref.once('value').then(function(snap){ var v=snap.val(); if(v){ merge(v); } else { ref.set(loadLocal()); }
        online=true; flush();
        ref.on('value',function(s){ var val=s.val(); if(val) merge(val); });
        console.log('[FS] connected to Firebase RTDB:',dbUrl);
      }).catch(function(err){ console.warn('[FS] RTDB read failed (rules?):',err.message); });
    }catch(e){ console.warn('[FS] database not enabled:',e.message); }
  }
  window.FS={storeId:STORE_ID,config:FIREBASE_CONFIG,
    get:function(k){var d=loadLocal();return k?d[k]:d},
    set:function(k,v){var d=loadLocal();d[k]=v;saveLocal(d);put('data',d)},
    save:function(d){saveLocal(d);put('data',d)},
    isOnline:function(){return online}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();