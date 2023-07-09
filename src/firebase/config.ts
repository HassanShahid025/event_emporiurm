import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FB_API_KEY,
  authDomain: "eshop-b68db.firebaseapp.com",
  projectId: "eshop-b68db",
  storageBucket: "eshop-b68db.appspot.com",
  messagingSenderId: "1036971393470",
  appId: "1:1036971393470:web:f4cc74160e76d77cb7b9ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
