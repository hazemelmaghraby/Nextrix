// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const QnsConfig = {
    apiKey: "AIzaSyBFkpp2ATc37sHv_h1e5juuCx4OOXtpK0o",
    authDomain: "qn-s-49ebc.firebaseapp.com",
    projectId: "qn-s-49ebc",
    storageBucket: "qn-s-49ebc.firebasestorage.app",
    messagingSenderId: "1095080549770",
    appId: "1:1095080549770:web:d656c1d7c3388034f47c73",
    measurementId: "G-HCYZK8GR9H"
};


const QnsApp = !getApps().some(app => app.name === "Qns")
    ? initializeApp(QnsConfig, "Qns")
    : getApp("Qns");
// Initialize Firebase
const analytics = getAnalytics(QnsApp);
const QnsGoogleProvider = new GoogleAuthProvider();
const QnsAuth = getAuth(QnsApp);
const QnsDb = getFirestore(QnsApp);

export { QnsAuth, QnsDb, QnsGoogleProvider };