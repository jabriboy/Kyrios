// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkW2wimBeEhBzIkUmfhLBpXubjqrPAH8k",
  authDomain: "connection-88994.firebaseapp.com",
  projectId: "connection-88994",
  storageBucket: "connection-88994.firebasestorage.app",
  messagingSenderId: "386011809212",
  appId: "1:386011809212:web:252b5581ae079ae9cdd7b9",
  measurementId: "G-KXSXHY5S3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app)

export {
  app, 
  analytics, 
  db
}