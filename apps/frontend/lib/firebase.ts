import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBoVa7LlMV9WZkS4TVgMx7SXTn_E2gjt0Q",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bitebase-3d5f9.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bitebase-3d5f9",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bitebase-3d5f9.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "869869191395",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:869869191395:web:0bb2821dfc368800e305d6",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-CB8TNELCRL"
}

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = firebase.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider()

// Initialize Cloud Firestore and get a reference to the service
export const db = firebase.firestore()

// Initialize Cloud Storage and get a reference to the service
export const storage = firebase.storage()

export default app
