// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyCNM_SS_YDDHuB-9XfYsbL-RRnKJ3jaXkY",
  authDomain: "sutra-1bdf3.firebaseapp.com",
  projectId: "sutra-1bdf3",
  storageBucket: "sutra-1bdf3.firebasestorage.app",
  messagingSenderId: "607542807620",
  appId: "1:607542807620:web:cc5f07e603995f92a78011",
  measurementId: "G-PKJ1TEDMLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);