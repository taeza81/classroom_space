import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// 🌐 Firebase Authentication 공식 설정 연동 (환경변수 및 기본값 내장)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAxf-IwZ0FyAcRwsfWEeKM8FRZHWQ-R2xc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "class-space-3ea5b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "class-space-3ea5b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "class-space-3ea5b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "431960921941",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:431960921941:web:b6e883cd60283cab17c1dc",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XBPXVC7RFC"
};

let app = null;
let auth = null;

export const isFirebaseConfigured = () => {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
};

try {
  if (isFirebaseConfigured()) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
} catch (error) {
  console.warn('Firebase initialization notice:', error);
}

export { app, auth, firebaseConfig };
