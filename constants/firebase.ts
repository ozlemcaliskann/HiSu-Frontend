// Replace the mock implementation with actual Firebase initialization
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithCredential,
  signInWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpTHvSKUzEiTbMW_EbcChHvXrNAIA4E3c",
  authDomain: "hisu-a8493.firebaseapp.com",
  projectId: "hisu-a8493",
  storageBucket: "hisu-a8493.firebasestorage.app",
  messagingSenderId: "792408514806",
  appId: "1:792408514806:web:82ad3d3fbad419b3740cd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Create a Google provider instance
const provider = new GoogleAuthProvider();

// Export all the Firebase modules and functions
export { 
  auth, 
  provider, 
  signInWithCredential, 
  signInWithEmailAndPassword,
  firebaseOnAuthStateChanged as onAuthStateChanged, 
  firebaseSignOut as signOut,
  db 
};