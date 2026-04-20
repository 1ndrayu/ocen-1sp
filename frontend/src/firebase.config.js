import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Replace these with actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBykGRgtjsrrnPoeQO155LgSkFb2nLK8fE",
  authDomain: "ocen-dev1.firebaseapp.com",
  projectId: "ocen-dev1",
  storageBucket: "ocen-dev1.firebasestorage.app",
  messagingSenderId: "654252397904",
  appId: "1:654252397904:web:b8ada889779a5e000c8855",
  measurementId: "G-C7YYR2LPJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
