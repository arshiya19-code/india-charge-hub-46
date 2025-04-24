
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
// These are placeholder values - in a real project, you would use actual Firebase credentials
const firebaseConfig = {
  apiKey: "AIzaSyDqZsZyzE2aUcf-GxcuD9N41dJaHt-TNsE",
  authDomain: "india-charge-hub-demo.firebaseapp.com",
  projectId: "india-charge-hub-demo",
  storageBucket: "india-charge-hub-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuv"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
