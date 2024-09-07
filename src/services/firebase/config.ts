// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "echo-aed9e.firebaseapp.com",
  projectId: "echo-aed9e",
  storageBucket: "echo-aed9e.appspot.com",
  messagingSenderId: "575680247659",
  appId: "1:575680247659:web:877e1b8a9d73be86d7be2e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth, app };
