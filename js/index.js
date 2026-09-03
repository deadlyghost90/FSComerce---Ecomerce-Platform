// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ShadowMotion - Core Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwvC1MlB-_7cmV-Hmi8MyXthGrFUGbwkY",
  authDomain: "fscomerce.firebaseapp.com",
  databaseURL: "https://fscomerce-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fscomerce",
  storageBucket: "fscomerce.firebasestorage.app",
  messagingSenderId: "977420297543",
  appId: "1:977420297543:web:b005a014795112c24a9862"
};

// Initialize ShadowMotion Engine
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. AUTHENTICATION (LOGIN ENGINE)
  // ==========================================
  const loginForm = document.getElementById("loginForm");
  const signInBtn = document.getElementById("signInBtn");
  const loginErrorMsg = document.getElementById("loginErrorMsg");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        signInBtn.textContent = "Authenticating...";
        signInBtn.disabled = true;
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html"; 
      } catch (error) {
        loginErrorMsg.textContent = "Access Denied. Invalid credentials.";
        loginErrorMsg.classList.remove("hidden");
        signInBtn.textContent = "Sign In";
        signInBtn.disabled = false;
        console.error("[ShadowMotion] Error:", error.code);
      }
    });
  }

  // ==========================================
  // 2. SPA REAL-TIME DASHBOARD LOGIC
  // ==========================================
  const realtimeOrdersTable = document.getElementById("realtime-orders-table");
  
  if (realtimeOrdersTable) {
    
    const saveVisualBtn = document.getElementById("saveVisualBtn");
    const saveCodeBtn = document.getElementById("saveCodeBtn");
    const cssCodeInput = document.getElementById("cssCodeInput");
    const uiRevenue = document.getElementById("ui-rev");
    const uiOrdersCount = document.getElementById("ui-orders");

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(`[ShadowMotion] Admin authenticated: ${user.uid}`);

        const storesRef = ref(database, 'stores');
        get(storesRef).then((snapshot) => {
          if (snapshot.exists()) {
            const allStores = snapshot.val();
            let myStoreId = null;

            for (const [id, data] of Object.entries(allStores)) {
              if (data.ownerId === user.uid) {
                myStoreId = id;
                break;
              }
            }

            if (myStoreId) {
              console.log(`[ShadowMotion] Store mounted: ${myStoreId}`);

              // A. Real-time Orders
              const ordersRef = ref(database, `stores/${myStoreId}/orders`);
              onValue(ordersRef, (snap) => {
                realtimeOrdersTable.innerHTML = "";
                
                if (snap.exists()) {
                  let orderCount = 0;
                  let totalRevenue = 0;
                  
                  const ordersList = Object.entries(snap.val()).reverse();
                  
                  for (const [orderKey, order] of ordersList) {
                    orderCount++;
                    totalRevenue += parseInt(order.totalAmount || 0);

                    const tr = document.createElement("tr");
                    tr.className = "hover:bg-dark-400/50 transition-colors";
                    
                    const statusColor = order.status === 'Pending' 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-brand-500/20 text-brand-500';

                    tr.innerHTML = `
                      <td class="px-6 py-4">
                        <p class="font-medium text-white">${order.customerName}</p>
                        <p class="text-xs text-gray-500 font-mono">#${orderKey.substring(orderKey.length - 6).toUpperCase()}</p>
                      </td>
                      <td class="px-6 py-4 font-medium text-white">Rs. ${parseInt(order.totalAmount).toLocaleString()}</td>
                      <td class="px-6 py-4">
                        <span class="px-3 py-1 text-[10px] uppercase tracking-widest font-medium rounded-full ${statusColor}">
                          ${order.status}
                        </span>
                      </td>
                    `;
                    realtimeOrdersTable.appendChild(tr);
                  }
                  
                  if(uiRevenue) uiRevenue.innerText = `Rs. ${totalRevenue.toLocaleString()}`;
                  if(uiOrdersCount) uiOrdersCount.innerText = orderCount;

                } else {
                  realtimeOrdersTable.innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-gray-500">No orders yet. Listening...</td></tr>`;
                  if(uiRevenue) uiRevenue.innerText = `Rs. 0`;
                  if(uiOrdersCount) uiOrdersCount.innerText = "0";
                }
              });

              // B. Visual Editor Push
              if (saveVisualBtn) {
                saveVisualBtn.addEventListener("click", () => {
                  saveVisualBtn.textContent = "Pushing...";
                  
                  const alpineState = document.querySelector('body').__x.$data;
                  
                  const themePayload = {
                    primaryColor: alpineState.themeColor,
                    heroTitle: alpineState.heroTitle,
                    showHero: alpineState.showHero,
                    lastUpdated: new Date().toISOString()
                  };

                  update(ref(database, `stores/${myStoreId}/design`), themePayload).then(() => {
                    saveVisualBtn.textContent = "Saved!";
                    setTimeout(() => saveVisualBtn.textContent = "Push to Storefront", 2500);
                  }).catch(err => {
                    console.error("[ShadowMotion] Visual Push Failed", err);
                  });
                });
              }

              // C. Code Editor
              if (saveCodeBtn && cssCodeInput) {
                get(ref(database, `stores/${myStoreId}/customCode/css`)).then(snap => {
                  if(snap.exists()) cssCodeInput.value = snap.val();
                });

                saveCodeBtn.addEventListener("click", () => {
                  saveCodeBtn.textContent = "Deploying...";
                  
                  update(ref(database, `stores/${myStoreId}/customCode`), {
                    css: cssCodeInput.value,
                    lastDeployed: new Date().toISOString()
                  }).then(() => {
                    saveCodeBtn.textContent = "Deployed!";
                    setTimeout(() => saveCodeBtn.textContent = "Deploy Code", 2500);
                  }).catch(err => {
                    console.error("[ShadowMotion] Deploy Failed", err);
                  });
                });
              }

            } else {
              console.warn("[ShadowMotion] No store found.");
            }
          }
        });
      } else {
        window.location.href = "signin.html";
      }
    });
  }
});
