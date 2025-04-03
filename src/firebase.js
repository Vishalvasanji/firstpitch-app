// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your config (you already provided it)
const firebaseConfig = {
  apiKey: "AIzaSyAX_CW--qItAtClesnoAdRBjcQmu0DDQjE",
  authDomain: "firstpitch-76cac.firebaseapp.com",
  projectId: "firstpitch-76cac",
  storageBucket: "firstpitch-76cac.firebasestorage.app",
  messagingSenderId: "798477745863",
  appId: "1:798477745863:web:ad79d4f6511ba872e188e2",
  measurementId: "G-GPCQP13X8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
