import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAKmUfLx62i5uVgi4ipXfA8FKoEcPbIrYU",
  authDomain: "event-emporium-1949d.firebaseapp.com",
  projectId: "event-emporium-1949d",
  storageBucket: "event-emporium-1949d.appspot.com",
  messagingSenderId: "1018283384486",
  appId: "1:1018283384486:web:8d1dcd69158402265c9e67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
