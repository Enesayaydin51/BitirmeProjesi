// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Platform } from "react-native";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPhmWXn_OZX2g78jg9qzKyJ6_S1mhjSqU",
  authDomain: "gym-app-7d32e.firebaseapp.com",
  projectId: "gym-app-7d32e",
  storageBucket: "gym-app-7d32e.firebasestorage.app",
  messagingSenderId: "805187809101",
  appId: "1:805187809101:web:a09eccf40276c90a1dd104",
  measurementId: "G-GEGB0L342J"
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