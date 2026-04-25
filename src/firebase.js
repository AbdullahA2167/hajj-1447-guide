// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Optional: only if you really want analytics on the web
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCwVK_NKyQHLpAXLlqTkTwLiIfQgFgcvJo",
  authDomain: "hajj-guide-b729c.firebaseapp.com",
  projectId: "hajj-guide-b729c",
  storageBucket: "hajj-guide-b729c.firebasestorage.app",
  messagingSenderId: "789545123912",
  appId: "1:789545123912:web:be01c365fd68b9e4b9d87d",
  measurementId: "G-8RNE6KFHSW"
};

const app = initializeApp(firebaseConfig); // [web:26]

// If you really want analytics in production only, you can conditionally enable it
// if (import.meta.env.PROD) {
//   const analytics = getAnalytics(app);
// }

export const db = getFirestore(app);      // Firestore instance [web:12][web:19]
export const storage = getStorage(app);   // Storage instance [web:18][web:24]