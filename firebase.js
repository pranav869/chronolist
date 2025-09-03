// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjKBRj0t_UQc97ubbQ-tiU--eVYRW4uM8",
  authDomain: "todo-cbcd2.firebaseapp.com",
  projectId: "todo-cbcd2",
  storageBucket: "todo-cbcd2.firebasestorage.app",
  messagingSenderId: "229931990898",
  appId: "1:229931990898:web:59204d70b7089a2de3e7eb",
  measurementId: "G-ZT0K83YQEN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);