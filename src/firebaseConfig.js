// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC204QZdHzbSPdoYjxGrUYEYmAUbZLArrA",
  authDomain: "sampling-guide.firebaseapp.com",
  databaseURL: "https://sampling-guide-default-rtdb.firebaseio.com",
  projectId: "sampling-guide",
  storageBucket: "sampling-guide.firebasestorage.app",
  messagingSenderId: "505992154315",
  appId: "1:505992154315:web:ab2933d28d049bf4779f4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

export default database;
