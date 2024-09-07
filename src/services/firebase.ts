// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ed-tech-test-62e07.firebaseapp.com",
  projectId: "ed-tech-test-62e07",
  storageBucket: "ed-tech-test-62e07.appspot.com",
  messagingSenderId: "1057786291201",
  appId: "1:1057786291201:web:8a9d94beeaf1216b970c00",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
