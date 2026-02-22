// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_API_KEY, 
  authDomain: "stride-4e9e3.firebaseapp.com",
  projectId: "stride-4e9e3",
  storageBucket: "stride-4e9e3.firebasestorage.app",
  messagingSenderId: "928934383106",
  appId: "1:928934383106:web:8c2a7502b3be6043f3611b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };