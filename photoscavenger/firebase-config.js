// Firebase Configuration
// Replace these values with your Firebase project config
// Get this from: Firebase Console > Project Settings > Your apps > Web app
// 
// IMPORTANT: This file contains sensitive keys and should NOT be committed to git.
// Copy firebase-config.template.js to firebase-config.js and fill in your values.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Set to true to enable Firebase Storage, false to use localStorage
const USE_FIREBASE = false;
