import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBooR_2ojuDOe2Fl7vwqzSCRQToYRzeRsE",
  authDomain: "mali-tap.firebaseapp.com",
  projectId: "mali-tap",
  storageBucket: "mali-tap.firebasestorage.app",
  messagingSenderId: "413113950192",
  appId: "1:413113950192:web:80e88b4fda05f6537fc735"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);