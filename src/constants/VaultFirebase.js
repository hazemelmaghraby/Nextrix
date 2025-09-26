// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const vaultConfig = {
    apiKey: "AIzaSyA24xGMRWpfjh6quncWKmImLVX4UM4Faks",
    authDomain: "test-690a8.firebaseapp.com",
    projectId: "test-690a8",
    storageBucket: "test-690a8.firebasestorage.app",
    messagingSenderId: "873170899473",
    appId: "1:873170899473:web:93600f4379daedb725d7b0",
    measurementId: "G-944XG6QVKV"
};


const vaultApp = !getApps().some(app => app.name === "vault")
    ? initializeApp(vaultConfig, "vault")
    : getApp("vault");
// Initialize Firebase
const analytics = getAnalytics(vaultApp);
const vaultGoogleProvider = new GoogleAuthProvider();
const vaultAuth = getAuth(vaultApp);
const vaultDb = getFirestore(vaultApp);

export { vaultAuth, vaultDb, vaultGoogleProvider };