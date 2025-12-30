import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtrNDhqjlbHi3b0gvWpdHo5w8QKkPTDEU",
  authDomain: "adslot-book.firebaseapp.com",
  projectId: "adslot-book",
  appId: "1:119101536336:web:47e1cd95a75c8f23407955",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
