// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Fatahshaheen OS - Core Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwvC1MlB-_7cmV-Hmi8MyXthGrFUGbwkY",
  authDomain: "fscomerce.firebaseapp.com",
  databaseURL: "https://fscomerce-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fscomerce",
  storageBucket: "fscomerce.firebasestorage.app",
  messagingSenderId: "977420297543",
  appId: "1:977420297543:web:b005a014795112c24a9862"
};

// Initialize Engine
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
        signInBtn.textContent = "Authenticating Engine...";
        signInBtn.disabled = true;
        await signInWithEmailAndPassword(auth, email, password);
        // Successful login, redirect to master hub
        window.location.href = "dashboard.html"; 
      } catch (error) {
        loginErrorMsg.textContent = "Access Denied. Invalid credentials.";
        loginErrorMsg.classList.remove("hidden");
        signInBtn.textContent = "Sign In";
        signInBtn.disabled = false;
        console.error("[FSOS-Auth] Error:", error.code);
      }
    });
  }

  // ==========================================
  // 2. SPA REAL-TIME DASHBOARD LOGIC
  // ==========================================
  const realtimeOrdersTable = document.getElementById("realtime-orders-table");
  
  // If we are on the dashboard page, execute the SPA logic
  if (realtimeOrdersTable) {
    
    // UI Elements Mapping
    const saveVisualBtn = document.getElementById("saveVisualBtn");
    const saveCodeBtn = document.getElementById("saveCodeBtn");
    const cssCodeInput = document.getElementById("cssCodeInput");
    const uiRevenue = document.getElementById("ui-rev");
    const uiOrdersCount = document.getElementById("ui-orders");

    // Listen for Auth State
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(`[FSOS-Engine] Admin authenticated: ${user.uid}`);

        // Locate Tenant Store in Database
        const storesRef = ref(database, 'stores');
        get(storesRef).then((snapshot) => {
          if (snapshot.exists()) {
            const allStores = snapshot.val();
            let myStoreId = null;

            // Map the owner UID to their specific store
            for (const [id, data] of Object.entries(allStores)) {
              if (data.ownerId === user.uid) {
                myStoreId = id;
                break;
              }
            }

            if (myStoreId) {
              console.log(`[FSOS-Engine] Store mounted: ${myStoreId}`);

              // ------------------------------------------------
              // A. Real-time Orders & Metrics Listener
              // ------------------------------------------------
              const ordersRef = ref(database, `stores/${myStoreId}/orders`);
              onValue(ordersRef, (snap) => {
                realtimeOrdersTable.innerHTML = ""; // Clear table skeleton
                
                if (snap.exists()) {
                  let orderCount = 0;
                  let totalRevenue = 0;
                  
                  // Reverse array to show newest orders first
                  const ordersList = Object.entries(snap.val()).reverse();
                  
                  for (const [orderKey, order] of ordersList) {
                    orderCount++;
                    totalRevenue += parseInt(order.totalAmount || 0);

                    // Build dynamic row
                    const tr = document.createElement("tr");
                    tr.className = "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors";
                    
                    // Status Badge Coloring logic
                    const statusColor = order.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' 
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';

                    tr.innerHTML = `
                      <td class="px-6 py-4">
                        <p class="font-bold text-gray-900 dark:text-white">${order.customerName}</p>
                        <p class="text-xs text-gray-500 font-mono">#${orderKey.substring(orderKey.length - 6).toUpperCase()}</p>
                      </td>
                      <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">Rs. ${parseInt(order.totalAmount).toLocaleString()}</td>
                      <td class="px-6 py-4">
                        <span class="px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full ${statusColor}">
                          ${order.status}
                        </span>
                      </td>
                    `;
                    realtimeOrdersTable.appendChild(tr);
                  }
                  
                  // Inject Live Metrics into UI
                  if(uiRevenue) uiRevenue.innerText = `Rs. ${totalRevenue.toLocaleString()}`;
                  if(uiOrdersCount) uiOrdersCount.innerText = orderCount;

                } else {
                  // Empty State
                  realtimeOrdersTable.innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-gray-400 font-medium">No orders yet. Platform is listening...</td></tr>`;
                  if(uiRevenue) uiRevenue.innerText = `Rs. 0`;
                  if(uiOrdersCount) uiOrdersCount.innerText = "0";
                }
              });

              // ------------------------------------------------
              // B. Visual Editor Push Logic
              // ------------------------------------------------
              if (saveVisualBtn) {
                saveVisualBtn.addEventListener("click", () => {
                  saveVisualBtn.textContent = "Pushing to Edge...";
                  
                  // Extract state directly from Alpine.js context mapped to the body
                  const alpineState = document.querySelector('body').__x.$data;
                  
                  const themePayload = {
                    primaryColor: alpineState.themeColor,
                    heroTitle: alpineState.heroTitle,
                    showHero: alpineState.showHero,
                    lastUpdated: new Date().toISOString()
                  };

                  update(ref(database, `stores/${myStoreId}/design`), themePayload).then(() => {
                    saveVisualBtn.textContent = "Saved to Storefront!";
                    setTimeout(() => saveVisualBtn.textContent = "Push to Storefront", 2500);
                  }).catch(err => {
                    console.error("[FSOS-Error] Visual Push Failed", err);
                    saveVisualBtn.textContent = "Error! Try Again";
                  });
                });
              }

              // ------------------------------------------------
              // C. Advanced Code Editor Injection Logic
              // ------------------------------------------------
              if (saveCodeBtn && cssCodeInput) {
                // Fetch existing CSS to populate the editor on load
                get(ref(database, `stores/${myStoreId}/customCode/css`)).then(snap => {
                  if(snap.exists()) cssCodeInput.value = snap.val();
                });

                saveCodeBtn.addEventListener("click", () => {
                  saveCodeBtn.textContent = "Compiling & Deploying...";
                  
                  update(ref(database, `stores/${myStoreId}/customCode`), {
                    css: cssCodeInput.value,
                    lastDeployed: new Date().toISOString()
                  }).then(() => {
                    saveCodeBtn.textContent = "Code Deployed!";
                    setTimeout(() => saveCodeBtn.textContent = "Deploy Code", 2500);
                  }).catch(err => {
                    console.error("[FSOS-Error] Code Deploy Failed", err);
                  });
                });
              }

            } else {
              console.warn("[FSOS-Engine] No store mapping found for this UID.");
            }
          }
        });
      } else {
        // Kick unauthenticated users out
        console.warn("[FSOS-Engine] Unauthorized access detected. Redirecting.");
        window.location.href = "signin.html";
      }
    });
  }
});
