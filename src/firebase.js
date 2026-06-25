import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ← أضف ده

const firebaseConfig = {
  apiKey: "AIzaSyBUqxQMO7iOkXMNKN-KJuUf7j3326AqTMY",
  authDomain: "ashour-store.firebaseapp.com",
  projectId: "ashour-store",
  storageBucket: "ashour-store.firebasestorage.app",
  messagingSenderId: "737703480134",
  appId: "1:737703480134:web:cbe87b4d3b0f7d50da7347",
  measurementId: "G-9E9P9CZBV5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); // ← أضف ده