import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase project: Voice Smart Home Dashboard (voice-smart-home-muk)
const firebaseConfig = {
  apiKey: "AIzaSyAHBirqPDkWQdIR_6hlFXGxhKVUSc6qO0M",
  authDomain: "voice-smart-home-muk.firebaseapp.com",
  projectId: "voice-smart-home-muk",
  storageBucket: "voice-smart-home-muk.firebasestorage.app",
  messagingSenderId: "40537845090",
  appId: "1:40537845090:web:db4bad81502f2793cbd03b",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
