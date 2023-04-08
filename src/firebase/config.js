import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFlqJiWkq48TtjwGTO-rkh-qpB40-Pcqo",
  authDomain: "tz-project-6c24c.firebaseapp.com",
  projectId: "tz-project-6c24c",
  storageBucket: "tz-project-6c24c.appspot.com",
  messagingSenderId: "916128541467",
  appId: "1:916128541467:web:4b882c1675e5faf2e681be",
  measurementId: "G-LCF3TSSC6P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider, db };