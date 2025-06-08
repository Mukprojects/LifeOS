import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBlkwIzcntZLgvzTzrTF6fdH4jod8hlUZI",
  authDomain: "lifeos-2178b.firebaseapp.com",
  projectId: "lifeos-2178b",
  storageBucket: "lifeos-2178b.firebasestorage.app",
  messagingSenderId: "889754293538",
  appId: "1:889754293538:web:2a895f30789c352dd5c17b",
  measurementId: "G-97848ZBQ2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;