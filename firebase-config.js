import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth-compat.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore-compat.js";

const app = firebase.initializeApp({
  apiKey: "AIzaSyD1PqjsmOknKl2ZuRUORLG-4faiYFiuKA0",
  authDomain: "journai-6b1fe.firebaseapp.com",
  databaseURL: "https://journai-6b1fe-default-rtdb.firebaseio.com",
  projectId: "journai-6b1fe",
  storageBucket: "journai-6b1fe.appspot.com",
  messagingSenderId: "13426463829",
  appId: "1:13426463829:web:fdf1588552513c567f70dc",
  measurementId: "G-60CFJTY6S0"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };
