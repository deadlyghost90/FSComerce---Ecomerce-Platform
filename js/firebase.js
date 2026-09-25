// Firebase SDK Imports (ES Modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// FSComerce - Core Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwvC1MlB-_7cmV-Hmi8MyXthGrFUGbwkY",
  authDomain: "fscomerce.firebaseapp.com",
  databaseURL: "https://fscomerce-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fscomerce",
  storageBucket: "fscomerce.firebasestorage.app",
  messagingSenderId: "977420297543",
  appId: "1:977420297543:web:b005a014795112c24a9862"
};

// Initialize Firebase Engine
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
