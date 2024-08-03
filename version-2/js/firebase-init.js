// Import functions from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5bkFGvaBSLruos4zpIw9cYIm6dhRF9Jg",
  authDomain: "jellygut-f2b85.firebaseapp.com",
  databaseURL:
    "https://jellygut-f2b85-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jellygut-f2b85",
  storageBucket: "jellygut-f2b85.appspot.com",
  messagingSenderId: "849797410543",
  appId: "1:849797410543:web:361031666abf3113f5f51a",
  measurementId: "G-TPHY64LP64",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
