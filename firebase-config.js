// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAljG_IorAvqcwbUXyEu_P7bcuJdNH30yk",
  authDomain: "absensi-dewan-guru-dhiyaululum.firebaseapp.com",
  projectId: "absensi-dewan-guru-dhiyaululum",
  storageBucket: "absensi-dewan-guru-dhiyaululum.firebasestorage.app",
  messagingSenderId: "501013302609",
  appId: "1:501013302609:web:312b548db38a9c351f5770",
  measurementId: "G-GZ3KYWNVTV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
