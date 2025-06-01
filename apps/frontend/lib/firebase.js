// Firebase client setup with proper Next.js handling
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoVa7LlMV9WZkS4TVgMx7SXTn_E2gjt0Q",
  authDomain: "bitebase-3d5f9.firebaseapp.com",
  projectId: "bitebase-3d5f9",
  storageBucket: "bitebase-3d5f9.firebasestorage.app",
  messagingSenderId: "869869191395",
  appId: "1:869869191395:web:0bb2821dfc368800e305d6",
  measurementId: "G-CB8TNELCRL"
};

// Initialize Firebase
let app = null;
let auth = null;
let db = null;
let googleProvider = null;

// Only initialize on client side
if (typeof window !== 'undefined') {
  try {
    // Check if Firebase app is already initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    // Initialize auth and firestore
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Initialize Google provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

// Export with both naming conventions for backwards compatibility
export const firebase = app;
export const firebaseApp = app;
export const firebaseAuth = auth;
export const firebaseDb = db;
export const googleAuthProvider = googleProvider;
export { auth, db, app, googleProvider };