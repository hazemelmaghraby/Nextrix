// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBk0DdEeRYKXRw9PwC19PhgztxpXrWlCaY",
    authDomain: "nextrix-a5d36.firebaseapp.com",
    projectId: "nextrix-a5d36",
    storageBucket: "nextrix-a5d36.firebasestorage.app",
    messagingSenderId: "32370603400",
    appId: "1:32370603400:web:7256ba914eb78d8c44b63d",
    measurementId: "G-DCZ2ZXCGMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };