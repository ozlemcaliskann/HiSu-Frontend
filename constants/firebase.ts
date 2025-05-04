// Mock Firebase implementation to avoid loading errors
const app = { name: 'mock-firebase-app' };

// Define a User type for type checking
type User = {
  email?: string | null;
  displayName?: string | null;
  uid?: string;
};

// Type for the onAuthStateChanged callback
type AuthStateCallback = (user: User | null) => void;

// Mock auth object
const auth: {
  currentUser: User | null;
  onAuthStateChanged: (callback: AuthStateCallback) => () => void;
  signOut: () => Promise<void>;
} = {
  currentUser: null,
  onAuthStateChanged: (callback: AuthStateCallback) => {
    // Simulate no user is logged in
    callback(null);
    // Return mock unsubscribe function
    return () => {};
  },
  signOut: () => Promise.resolve()
};

// Mock provider
const provider = { providerId: 'google.com' };

// Mock Firestore DB
const db = { collection: () => ({ get: () => Promise.resolve({ docs: [] }) }) };

// Mock functions
const signInWithCredential = () => Promise.resolve({ user: null });
const onAuthStateChanged = auth.onAuthStateChanged;
const signOut = auth.signOut;

export { auth, provider, signInWithCredential, signOut, db, onAuthStateChanged };
