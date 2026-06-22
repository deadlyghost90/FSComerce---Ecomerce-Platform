// Keep your existing imports at the top
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCwvC1MlB-_7cmV-Hmi8MyXthGrFUGbwkY",
  authDomain: "fscomerce.firebaseapp.com",
  databaseURL: "https://fscomerce-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fscomerce",
  storageBucket: "fscomerce.firebasestorage.app",
  messagingSenderId: "977420297543",
  appId: "1:977420297543:web:b005a014795112c24a9862"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. LOGIN LOGIC (From your previous message) ---
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
        loginErrorMsg.textContent = "Invalid email or password.";
        loginErrorMsg.classList.remove("hidden");
        signInBtn.textContent = "Sign In";
        signInBtn.disabled = false;
      }
    });
  }

  // --- 2. DASHBOARD DATA LOGIC (Shopify Style Real-time) ---
  // Only execute this if we are on the dashboard page
  const previewUrlText = document.getElementById("previewUrlText");
  const viewStoreTopBtn = document.getElementById("viewStoreTopBtn");
  
  if (previewUrlText) {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, find their store in RTDB
        const storesRef = ref(database, 'stores');
        get(storesRef).then((snapshot) => {
          if (snapshot.exists()) {
            const allStores = snapshot.val();
            let myStoreId = null;
            let myStoreData = null;

            // Find the store belonging to this user
            for (const [id, data] of Object.entries(allStores)) {
              if (data.ownerId === user.uid) {
                myStoreId = id;
                myStoreData = data;
                break;
              }
            }

            if (myStoreData) {
              // Update Alpine.js State via Window for HTML rendering
              window.Alpine.store('storeName', myStoreData.storeName);
              
              // Simulate Live Visitors (Random number that updates every 5 seconds)
              setInterval(() => {
                document.querySelector('[x-text="liveVisitors"]').innerText = Math.floor(Math.random() * (15 - 2 + 1) + 2);
              }, 5000);

              // Update URL previews
              const protocolUrl = `https://${myStoreData.storeUrl}`;
              previewUrlText.innerText = myStoreData.storeUrl;
              viewStoreTopBtn.href = protocolUrl;

              // Setup SEO Form Push Logic
              const seoForm = document.getElementById("seoForm");
              if(seoForm){
                seoForm.addEventListener("submit", (e) => {
                  e.preventDefault();
                  const title = document.getElementById("seoTitle").value;
                  const desc = document.getElementById("seoDesc").value;
                  const keywords = document.getElementById("seoKeywords").value;

                  // Realtime push to Firebase
                  set(ref(database, `stores/${myStoreId}/seo`), {
                    title: title,
                    description: desc,
                    keywords: keywords
                  }).then(() => {
                    alert("SEO Settings updated securely!");
                  }).catch((err) => {
                    alert("Error saving: " + err.message);
                  });
                });
              }
            }
          }
        });
      } else {
        // User is logged out, kick them back to login
        window.location.href = "signin.html";
      }
    });
  }
});