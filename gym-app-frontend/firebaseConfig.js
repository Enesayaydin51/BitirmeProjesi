// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Platform } from "react-native";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase config değerleri environment variable'lardan okunur
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBPhmWXn_OZX2g78jg9qzKyJ6_S1mhjSqU",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "gym-app-7d32e.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "gym-app-7d32e",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "gym-app-7d32e.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "805187809101",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:805187809101:web:a09eccf40276c90a1dd104",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GEGB0L342J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics'i sadece web platformunda başlat (React Native'de desteklenmiyor)
let analytics = null;
if (Platform.OS === 'web') {
  try {
    const { getAnalytics } = require("firebase/analytics");
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Firebase Analytics web platformunda başlatılamadı:', error);
  }
}

export default app;