import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAfIZhp0fMxz8a6RPh19Kxz-1qGOSHiA5E",
  authDomain: "flowboard-b0f9e-86805.firebaseapp.com",
  projectId: "flowboard-b0f9e-86805",
  storageBucket: "flowboard-b0f9e-86805.appspot.com",
  messagingSenderId: "92020676668",
  appId: "1:92020676668:web:7ce157d9eafae8ffb90b39"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const fbFunctions = getFunctions(app);

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9098");
  connectFirestoreEmulator(db, "localhost", 8082);
  connectFunctionsEmulator(fbFunctions, "localhost", 5002);
}
