import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBnm5zoiv9qWj6tKYY1NaxDKQjtR-RgVz4",
  authDomain: "atozservo.firebaseapp.com",
  projectId: "atozservo",
  storageBucket: "atozservo.appspot.com", 
  messagingSenderId: "858738863668",
  appId: "1:858738863668:web:f1db96e30aa74f293d2461",
  measurementId: "G-M919N1EGSK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

// Storage
const storage = getStorage(app);

export { db, storage };
