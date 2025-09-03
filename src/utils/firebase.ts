import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyDRWkPOv-SDq7bKJaDrFIJ4RINu4Er2fCM",
  authDomain: "dynamiclarning.firebaseapp.com",
  projectId: "dynamiclarning",
  storageBucket: "dynamiclarning.firebasestorage.app",
  messagingSenderId: "307108843657",
  appId: "1:307108843657:web:86041ab2fa1055d8b97658",
  measurementId: "G-W2FW5JT7GQ"
}

// Firebase initialisieren
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const analytics = getAnalytics(app)