// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider  } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqT15IPqCEmBQWTXT0Pz3VUQOXbdi3TzM",
  authDomain: "photo-sharing-43214.firebaseapp.com",
  projectId: "photo-sharing-43214",
  storageBucket: "photo-sharing-43214.firebasestorage.app",
  messagingSenderId: "393292716882",
  appId: "1:393292716882:web:af2ee2772393ac3164388b",
  measurementId: "G-V0LFMGZCQR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

const saveUserToFirestore = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: "",
      lastname: "",
      avatarUrl: "",
      createdAt: new Date(),
    });
  }
};


onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User authorized", user);
    saveUserToFirestore(user);
  } else {
    console.log("User is not authorized");
  }
});

export { auth, db , storage, googleProvider};
export default app;