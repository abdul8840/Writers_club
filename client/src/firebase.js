// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "writersclub-66f91.firebaseapp.com",
  projectId: "writersclub-66f91",
  storageBucket: "writersclub-66f91.appspot.com",
  messagingSenderId: "378127410428",
  appId: "1:378127410428:web:66123e27f743012b206379"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);