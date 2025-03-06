import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// **Firebase Config**
const firebaseConfig = {
  apiKey: "AIzaSyBpTHvSKUzEiTbMW_EbcChHvXrNAIA4E3c",
  authDomain: "hisu-a8493.firebaseapp.com",
  projectId: "hisu-a8493",
  storageBucket: "hisu-a8493.firebasestorage.app",
  messagingSenderId: "792408514806",
  appId: "1:792408514806:web:82ad3d3fbad419b3740cd7",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Only use `initializeAuth` for **custom persistence handling**
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithCredential, signOut, db, onAuthStateChanged };
