import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDn2g6fsmhXstjH0iZ0K0H0Og03DaM9JWE",
  authDomain: "psec-ai.firebaseapp.com",
  projectId: "psec-ai",
  storageBucket: "psec-ai.firebasestorage.app",
  messagingSenderId: "11870599946",
  appId: "1:11870599946:web:af5708ba9e78d7ca2758f3",
  measurementId: "G-SSTXJW0X6T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getFirestore(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
