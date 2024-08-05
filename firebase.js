import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCP1gq7u7CuOu3YhlhN3Q3twvq-by86nvs",
  authDomain: "pantry-tracker-df6e2.firebaseapp.com",
  projectId: "pantry-tracker-df6e2",
  storageBucket: "pantry-tracker-df6e2.appspot.com",
  messagingSenderId: "223646985607",
  appId: "1:223646985607:web:932a36c4c3be334ea13722",
  measurementId: "G-1XTK6Q64SH",
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
export { firestore, auth };
