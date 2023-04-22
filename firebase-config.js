// Import the functions you need from the SDKs you need
import { initializeApp } from '/node_modules/firebase/app';
import { getAuth } from '/node_modules/firebase/auth';
import { getFirestore } from '/node_modules/firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1PqjsmOknKl2ZuRUORLG-4faiYFiuKA0",
  authDomain: "journai-6b1fe.firebaseapp.com",
  projectId: "journai-6b1fe",
  storageBucket: "journai-6b1fe.appspot.com",
  messagingSenderId: "13426463829",
  appId: "1:13426463829:web:fdf1588552513c567f70dc",
  measurementId: "G-60CFJTY6S0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
